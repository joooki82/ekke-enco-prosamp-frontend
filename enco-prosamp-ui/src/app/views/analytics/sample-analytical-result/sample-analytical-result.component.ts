import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgIf, NgForOf} from '@angular/common';
import {forkJoin, of} from 'rxjs';
import {catchError} from 'rxjs/operators';


import {CardComponent, ButtonDirective, CardBodyComponent} from '@coreui/angular';
import {Observable} from 'rxjs';
import {
  SampleAnalyticalResultRequestDTO, SampleAnalyticalResultResponseDTO,
  SampleAnalyticalResultService
} from "../../../services/analytics/sample-analytical-result.service";
import {
  SamplingRecordLookupModalComponent
} from "../../sampling/samples/modal/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {
  SampleListItemDTO,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";
import {SampleResponseDTO, SamplesService} from "../../../services/sampling/samples.service";
import {
  AnalyticalLabReportResponseDTO,
  AnalyticalLabReportService
} from "../../../services/reports/analytical-lab-report.service";
import {
  MeasurementUnitResponseDTO,
  MeasurementUnitService
} from "../../../services/laboratory/measurement-unit.service";
import {
  SampleContaminantLinkService,
  SampleContaminantListItem2DTO, SampleWithSampleContaminantsDTO
} from "../../../services/analytics/sample-contaminant-link.service";
import {FormsModule} from "@angular/forms";

interface EditableAnalyticalResult extends SampleAnalyticalResultRequestDTO {
  id?: number;
}

@Component({
  selector: 'app-sample-analytical-result',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    CardComponent,
    ButtonDirective,
    SamplingRecordLookupModalComponent,
    FormsModule,
    CardBodyComponent
  ],
  templateUrl: './sample-analytical-result.component.html',
  styleUrls: ['./sample-analytical-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleAnalyticalResultComponent implements OnInit {
  showLookupModal = false;
  selectedRecord: SamplingRecordResponseDTO | null = null;
  samples: SampleListItemDTO[] = [];

  measurementUnits: MeasurementUnitResponseDTO[] = [];
  labReports: AnalyticalLabReportResponseDTO[] = [];

  loading = false;

  sampleDataMap = new Map<
    number,
    {
      contaminants: SampleContaminantListItem2DTO[];
      results: Map<number, EditableAnalyticalResult>;
    }
  >();

  constructor(
    private samplesService: SamplesService,
    private contaminantService: SampleContaminantLinkService,
    private resultService: SampleAnalyticalResultService,
    private measurementUnitService: MeasurementUnitService,
    private labReportService: AnalyticalLabReportService
  ) {
  }

  ngOnInit(): void {
    this.loadMeasurementUnits();
    this.loadLabReports();
  }

  openRecordSelector(): void {
    this.showLookupModal = true;
  }

  handleModalClose(): void {
    this.showLookupModal = false;
  }

  onSamplingRecordSelected(record: SamplingRecordResponseDTO): void {
    this.selectedRecord = record;
    this.samples = record.samples ?? [];
    this.sampleDataMap.clear();

    const sampleIds = this.samples.map(s => s.id);
    this.loadContaminantsAndInitResults(sampleIds);
  }

  private loadContaminantsAndInitResults(sampleIds: number[]): void {
    this.loading = true;

    const contaminantRequests = sampleIds.map(id =>
      this.contaminantService.getSampleContaminantsBySample(id)
    );

    forkJoin(contaminantRequests).subscribe((results: SampleWithSampleContaminantsDTO[]) => {
      for (const dto of results) {
        const sampleId = dto.sample.id;
        const resultMap = new Map<number, EditableAnalyticalResult>();
        const contaminants = dto.sampleContaminants;

        this.sampleDataMap.set(sampleId, {contaminants, results: resultMap});

        for (const entry of contaminants) {
          const sampleContaminantId = entry.id;
          const contaminantId = entry.contaminant.id;

          this.resultService.get(sampleContaminantId).pipe(
            catchError(() => of(null)) // fallback if no result exists
          ).subscribe((saved: SampleAnalyticalResultResponseDTO | null) => {
            const value: EditableAnalyticalResult = saved
              ? {
                id: saved.id,
                sampleContaminantId,
                resultMain: saved.resultMain,
                resultControl: saved.resultControl,
                resultMainControl: saved.resultMainControl,
                resultMeasurementUnitId: saved.resultMeasurementUnit.id,
                isBelowDetectionLimit: saved.isBelowDetectionLimit,
                detectionLimit: saved.detectionLimit,
                measurementUncertainty: saved.measurementUncertainty,
                analysisMethod: saved.analysisMethod,
                labReportId: saved.labReport.id,
                analysisDate: saved.analysisDate
              }
              : this.createEmptyAnalyticalResult(sampleContaminantId);

            resultMap.set(contaminantId, value);
          });
        }
      }

      this.loading = false;
    });
  }

  private createEmptyAnalyticalResult(sampleContaminantId: number): EditableAnalyticalResult {
    return {
      sampleContaminantId,
      resultMain: 0,
      resultControl: 0,
      resultMainControl: 0,
      resultMeasurementUnitId: this.measurementUnits.length > 0 ? this.measurementUnits[0].id : 0,
      isBelowDetectionLimit: false,
      detectionLimit: 0,
      measurementUncertainty: 0,
      analysisMethod: '',
      labReportId: this.labReports.length > 0 ? this.labReports[0].id : 0,
      analysisDate: new Date().toISOString().slice(0, 16)
    };
  }

  getContaminants(sampleId: number): SampleContaminantListItem2DTO[] {
    return this.sampleDataMap.get(sampleId)?.contaminants ?? [];
  }

  getResult(sampleId: number, contaminantId: number): EditableAnalyticalResult | null {
    return this.sampleDataMap.get(sampleId)?.results.get(contaminantId) ?? null;
  }

  private loadMeasurementUnits(): void {
    this.measurementUnitService.getAll().subscribe(units => {
      this.measurementUnits = units;
    });
  }

  private loadLabReports(): void {
    this.labReportService.getAll().subscribe(reports => {
      this.labReports = reports;
    });
  }

  getResultValue(sampleId: number, contaminantId: number): EditableAnalyticalResult | undefined {
    return this.sampleDataMap.get(sampleId)?.results.get(contaminantId);
  }


  saveAll(): void {
    if (!this.selectedRecord) return;
    this.loading = true;

    const saveOps: Observable<any>[] = [];

    for (const [sampleId, {results}] of this.sampleDataMap.entries()) {
      for (const result of results.values()) {
        const dto: SampleAnalyticalResultRequestDTO = {
          sampleContaminantId: result.sampleContaminantId,
          resultMain: result.resultMain,
          resultControl: result.resultControl,
          resultMainControl: result.resultMainControl,
          resultMeasurementUnitId: result.resultMeasurementUnitId,
          isBelowDetectionLimit: result.isBelowDetectionLimit,
          detectionLimit: result.detectionLimit,
          measurementUncertainty: result.measurementUncertainty,
          analysisMethod: result.analysisMethod,
          labReportId: result.labReportId,
          analysisDate: result.analysisDate
        };

        if (result.id) {
          saveOps.push(this.resultService.update(result.id, dto));
        } else {
          saveOps.push(this.resultService.create(dto));
        }
      }
    }

    forkJoin(saveOps).subscribe({
      next: () => {
        console.log('All results saved.');
        this.loading = false;
        // Optionally reload
      },
      error: (err) => {
        console.error('Error saving:', err);
        this.loading = false;
      }
    });
  }
}

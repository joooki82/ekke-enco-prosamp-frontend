// sample-analytical-result.component.ts

import {
  Component,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {
  SampleAnalyticalResultRequestDTO,
  SampleAnalyticalResultResponseDTO,
  SampleAnalyticalResultService
} from "../../../services/analytics/sample-analytical-result.service";

import {
  SampleListItemDTO,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";

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
  SampleContaminantListItem2DTO,
  SampleWithSampleContaminantsDTO
} from "../../../services/analytics/sample-contaminant-link.service";

import {FormsModule} from "@angular/forms";
import {SamplingRecordLookupModalComponent} from "../../sampling/samples/modal/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {AnalyticalResultModalComponent} from "./modal/analytical-result-modal.component";
import {ButtonDirective, CardBodyComponent, CardComponent, SpinnerComponent} from "@coreui/angular";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-sample-analytical-result',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SamplingRecordLookupModalComponent,
    AnalyticalResultModalComponent,
    ButtonDirective,
    SpinnerComponent
  ],
  templateUrl: './sample-analytical-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleAnalyticalResultComponent implements OnInit {
  showLookupModal = false;
  selectedRecord: SamplingRecordResponseDTO | null = null;
  samples: SampleListItemDTO[] = [];

  selectedSample: SampleListItemDTO | null = null;

  measurementUnits: MeasurementUnitResponseDTO[] = [];
  labReports: AnalyticalLabReportResponseDTO[] = [];

  sampleDataMap = new Map<
    number,
    {
      contaminants: SampleContaminantListItem2DTO[];
      results: Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>;
    }
  >();

  isLoading = false;

  constructor(
    private contaminantService: SampleContaminantLinkService,
    private resultService: SampleAnalyticalResultService,
    private measurementUnitService: MeasurementUnitService,
    private labReportService: AnalyticalLabReportService,
    private notification: NotificationService
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

    this.isLoading = true;

    this.loadContaminantsAndResults(sampleIds).subscribe({
      next: () => {
        this.isLoading = false;
        this.notification.showSuccess('Szennyezőanyag adatok betöltve.');
      },
      error: () => {
        this.isLoading = false;
        this.notification.showError('Hiba történt az adatok betöltése közben.');
      }
    });
  }

  private loadContaminantsAndResults(sampleIds: number[]) {
    const contaminantRequests = sampleIds.map(id =>
      this.contaminantService.getSampleContaminantsBySample(id)
    );

    return forkJoin(contaminantRequests).pipe(
      // use inner observable to wait for analytical result calls
      switchMap((results: SampleWithSampleContaminantsDTO[]) => {
        const resultFetches = [];

        for (const dto of results) {
          const sampleId = dto.sample.id;
          const contaminants = dto.sampleContaminants;
          const resultMap = new Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>();

          this.sampleDataMap.set(sampleId, {contaminants, results: resultMap});

          for (const entry of contaminants) {
            const sampleContaminantId = entry.id;

            const fetch$ = this.resultService.getBySampleContaminantId(sampleContaminantId).pipe(
              catchError(() => of(null)),
              tap((saved: SampleAnalyticalResultResponseDTO | null) => {
                const value = saved ? {
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
                } : {
                  sampleContaminantId,
                  resultMain: 0,
                  resultControl: 0,
                  resultMainControl: 0,
                  resultMeasurementUnitId: this.measurementUnits[0]?.id || 0,
                  isBelowDetectionLimit: false,
                  detectionLimit: 0,
                  measurementUncertainty: 0,
                  analysisMethod: '',
                  labReportId: this.labReports[0]?.id || 0,
                  analysisDate: new Date().toISOString().slice(0, 16)
                };

                resultMap.set(sampleContaminantId, value);

                console.log("Set result:", {
                  sampleId,
                  sampleContaminantId,
                  value
                });
              })
            );

            resultFetches.push(fetch$);
          }
        }

        return forkJoin(resultFetches);
      }),
      map(() => void 0)
    );
  }

  openSampleModal(sample: SampleListItemDTO): void {
    const data = this.sampleDataMap.get(sample.id);
    if (this.isLoading) {
      this.notification.showWarning("Kérem, várjon az adatok betöltéséig.");
      return;
    }
    if (!data || data.results.size === 0) {
      this.notification.showWarning("Nincs elérhető adat ehhez a mintához.");
      return;
    }

    this.selectedSample = sample;
  }

  closeSampleModal(): void {
    this.selectedSample = null;
  }

  saveSampleResults(updated: Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>): void {
    const saveOps = [];

    for (const result of updated.values()) {
      const dto = { ...result };

      if (dto.id) {
        saveOps.push(this.resultService.update(dto.id, dto));
      } else {
        saveOps.push(this.resultService.create(dto));
      }
    }

    if (saveOps.length === 0) {
      this.notification.showWarning('Nincs mentendő adat.');
      return;
    }

    forkJoin(saveOps).subscribe({
      next: () => {
        this.notification.showSuccess('Eredmények sikeresen mentve.');
        this.selectedSample = null;
      },
      error: () => {
        this.notification.showError('Hiba történt a mentés során.');
      }
    });
  }

  getContaminants(sampleId: number) {
    return this.sampleDataMap.get(sampleId)?.contaminants ?? [];
  }

  getResults(sampleId: number) {
    return this.sampleDataMap.get(sampleId)?.results ?? new Map();
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
}

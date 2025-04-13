import {
  Component,
  OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef
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
import {
  SamplingRecordLookupModalComponent
} from "../../../shared/lookup-modals/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {AnalyticalResultModalComponent} from "./modal/analytical-result-modal.component";
import {SpinnerComponent} from "@coreui/angular";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-sample-analytical-result',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SamplingRecordLookupModalComponent,
    AnalyticalResultModalComponent,
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

  isLoading = false;

  sampleDataMap = new Map<
    number,
    {
      contaminants: SampleContaminantListItem2DTO[];
      results: Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>;
    }
  >();

  constructor(
    private contaminantService: SampleContaminantLinkService,
    private resultService: SampleAnalyticalResultService,
    private measurementUnitService: MeasurementUnitService,
    private labReportService: AnalyticalLabReportService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.notification.showError('Hiba történt az adatok betöltése közben.');
        this.cdr.detectChanges();
      }
    });
  }

  private loadContaminantsAndResults(sampleIds: number[]): Observable<void> {
    const contaminantRequests = sampleIds.map(id =>
      this.contaminantService.getSampleContaminantsBySample(id).pipe(
        catchError(err => {
          console.error(`Nem sikerült betölteni a szennyeződéseket a mintaazonosítóhoz=${id}`, err);
          return of(null);
        })
      )
    );

    return forkJoin(contaminantRequests).pipe(
      switchMap((results: (SampleWithSampleContaminantsDTO | null)[]) => {
        const sampleMapUpdates: Observable<void>[] = [];

        for (const dto of results) {
          if (!dto) {
            continue;
          }

          const sampleId = dto.sample.id;
          const contaminants = dto.sampleContaminants;
          const resultMap = new Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>();

          console.log(`Betöltés a mintaazonosítóhoz=${sampleId}, szennyező anyagokat=`, contaminants);

          const resultFetches: Observable<any>[] = [];

          for (const entry of contaminants) {
            const sampleContaminantId = entry.id;

            const fetch$ = this.resultService.getBySampleContaminantId(sampleContaminantId).pipe(
              catchError(err => {
                if (err.status !== 404) {
                  console.error(`Hiba az minta-szennyezőanyag eredményének lekérésekor=${sampleContaminantId}`, err);
                }
                return of(null);
              }),
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
              })
            );

            resultFetches.push(fetch$);
          }

          const perSample$ = forkJoin(resultFetches).pipe(
            tap(() => {
              this.sampleDataMap.set(sampleId, {
                contaminants,
                results: new Map(resultMap)
              });
              console.log(`A mintaazonosító eredményei betöltve=${sampleId}`, {
                contaminants,
                resultMap
              });
            }),
            map(() => void 0)
          );

          sampleMapUpdates.push(perSample$);
        }

        return forkJoin(sampleMapUpdates).pipe(map(() => void 0));
      })
    );
  }

  openSampleModal(sample: SampleListItemDTO): void {
    const data = this.sampleDataMap.get(sample.id);

    if (this.isLoading) {
      this.notification.showWarning("Kérem, várjon az adatok betöltéséig.");
      return;
    }

    if (!data) {
      this.notification.showWarning("Az adatok még nem töltődtek be. Próbálja újra.");
      return;
    }

    if (!data.contaminants?.length) {
      this.notification.showWarning("A mintához nem tartozik szennyezőanyag.");
      return;
    }

    this.selectedSample = sample;
    this.cdr.detectChanges();
  }

  closeSampleModal(): void {
    this.selectedSample = null;
    this.cdr.detectChanges();
  }

  saveSampleResults(updated: Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>): void {
    const saveOps = [];

    for (const result of updated.values()) {
      const dto = {...result};

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
        this.cdr.detectChanges();
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

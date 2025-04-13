import {Component} from '@angular/core';
import {
  AdjustmentMethodListItemDTO,
  MeasurementUnitListItemDTO,
  SampleRequestDTO,
  SampleResponseDTO,
  SamplesService, SamplingRecordDatM200ListItemDTO, SamplingTypeListItemDTO
} from "../../../services/sampling/samples.service";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent, OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {MeasurementUnitService} from "../../../services/laboratory/measurement-unit.service";
import {AdjustmentMethodService} from "../../../services/laboratory/adjustment-method.service";
import {SamplingTypeService} from "../../../services/laboratory/sampling-type.service";
import {
  SamplingRecordLookupModalComponent
} from "../../../shared/lookup-modals/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-samples',
  imports: [
    DatePipe,
    RowComponent,
    ColComponent,
    ModalComponent,
    FormsModule,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    CardComponent,
    CardBodyComponent,
    NgIf,
    ButtonDirective,
    NgForOf,
    SamplingRecordLookupModalComponent,
    OffcanvasBodyComponent,
    OffcanvasHeaderComponent,
    OffcanvasComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './samples.component.html',
  styleUrl: './samples.component.scss'
})
export class SamplesComponent {
  samples: SampleResponseDTO[] = [];
  filteredSamples: SampleResponseDTO[] = [];

  searchText: string = '';
  isModalOpen: boolean = false;

  newSample: SampleRequestDTO = this.createEmptySample();
  selectedSampleId: number | null = null;
  formValidated: boolean = false;

  measurementUnits: MeasurementUnitListItemDTO[] = [];
  adjustmentMethods: AdjustmentMethodListItemDTO[] = [];
  samplingTypes: SamplingTypeListItemDTO[] = [];

  isRecordLookupOpen: boolean = false;
  selectedSamplingRecord?: SamplingRecordDatM200ListItemDTO;

  selectedSampleForDetails: SampleResponseDTO | null = null;
  isDrawerOpen = false;


  constructor(private sampleService: SamplesService,
              private measurementUnitService: MeasurementUnitService,
              private adjustmentMethodService: AdjustmentMethodService,
              private notificationService: NotificationService,
              private samplingTypeService: SamplingTypeService) {
    this.loadSamples();
    this.loadLookups();
  }

  loadLookups(): void {
    this.measurementUnitService.getAll().subscribe(data => this.measurementUnits = data);
    this.adjustmentMethodService.getAll().subscribe(data => this.adjustmentMethods = data);
    this.samplingTypeService.getAll().subscribe(data => this.samplingTypes = data);
  }

  isFormValid(): boolean {
    const s = this.newSample;
    return !!(
      s.sampleIdentifier?.trim() &&
      s.samplingRecordId &&
      s.sampleVolumeFlowRateUnitId &&
      s.sampleType &&
      s.status &&
      (!s.humidity || (s.humidity >= 0 && s.humidity <= 100)) &&
      (!s.temperature || (s.temperature >= -100 && s.temperature <= 100)) &&
      (!s.pressure || (s.pressure >= 800 && s.pressure <= 1100)) &&
      (!s.sampleVolumeFlowRate || s.sampleVolumeFlowRate >= 0) &&
      (!s.startTime || !s.endTime || new Date(s.startTime) < new Date(s.endTime))
    );
  }


  loadSamples(): void {
    this.sampleService.getAll().subscribe({
      next: data => {
        this.samples = data;
        this.filterSamples();
        console.log('Samples loaded:', data);
      },
      error: err => {
        console.error('API error:', err);
        this.notificationService.showError('Nem sikerült a mintákat betölteni.');
      }
    });
  }

  filterSamples(): void {
    const text = this.searchText.toLowerCase();
    this.filteredSamples = this.samples.filter(s =>
      s.sampleIdentifier.toLowerCase().includes(text) ||
      s.location?.toLowerCase().includes(text) ||
      s.employeeName?.toLowerCase().includes(text) ||
      s.status.toLowerCase().includes(text)
    );
  }

  openModal(sample?: SampleResponseDTO): void {
    if (sample) {
      this.selectedSampleId = sample.id;
      this.newSample = {
        samplingRecordId: sample.samplingRecord.id,
        sampleIdentifier: sample.sampleIdentifier,
        location: sample.location,
        employeeName: sample.employeeName,
        temperature: sample.temperature,
        humidity: sample.humidity,
        pressure: sample.pressure,
        sampleVolumeFlowRate: sample.sampleVolumeFlowRate,
        sampleVolumeFlowRateUnitId: sample.sampleVolumeFlowRateUnit.id,
        startTime: sample.startTime,
        endTime: sample.endTime,
        sampleType: sample.sampleType,
        status: sample.status,
        remarks: sample.remarks,
        adjustmentMethodId: sample.adjustmentMethod?.id,
        samplingTypeId: sample.samplingType?.id
      };
    } else {
      this.selectedSampleId = null;
      this.newSample = this.createEmptySample();
    }
    this.formValidated = false;
    this.isModalOpen = true;
  }

  createEmptySample(): SampleRequestDTO {
    return {
      samplingRecordId: 0,
      sampleIdentifier: '',
      sampleVolumeFlowRateUnitId: 0,
      sampleType: 'AK',
      status: 'ACTIVE'
    };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    this.formValidated = true;

    if (!this.isFormValid()) {
      this.notificationService.showError('Kérjük, javítsa a hibákat az űrlapon.');
      return;
    }



    const isNew = this.selectedSampleId == null;
    const request = isNew
      ? this.sampleService.create(this.newSample)
      : this.sampleService.update(this.selectedSampleId!, this.newSample);

    request.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          isNew ? 'Minta sikeresen létrehozva' : 'Minta frissítve'
        );
        this.closeModal();
        this.loadSamples();
      },
      error: () => {
        this.notificationService.showError('Hiba történt a mentés során');
      }
    });
  }

  onSamplingRecordSelected(record: SamplingRecordDatM200ListItemDTO): void {
    this.selectedSamplingRecord = record;
    this.newSample.samplingRecordId = record.id;
  }

  openDetails(sample: SampleResponseDTO): void {
    this.selectedSampleForDetails = sample;
    this.isDrawerOpen = true;
  }

  closeDetails(): void {
    this.selectedSampleForDetails = null;
    this.isDrawerOpen = false;
  }

  isDateRangeInvalid(): boolean {
    const { startTime, endTime } = this.newSample;
    if (!startTime || !endTime) return false;
    return new Date(startTime) >= new Date(endTime);
  }



}

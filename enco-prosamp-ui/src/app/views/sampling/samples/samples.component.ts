import { Component } from '@angular/core';
import {
  AdjustmentMethodListItemDTO,
  MeasurementUnitListItemDTO,
  SampleRequestDTO,
  SampleResponseDTO,
  SamplesService, SamplingRecordDatM200ListItemDTO, SamplingTypeListItemDTO
} from "../../../services/sampling/samples.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {MeasurementUnitService} from "../../../services/laboratory/measurement-unit.service";
import {AdjustmentMethodService} from "../../../services/laboratory/adjustment-method.service";
import {SamplingTypeService} from "../../../services/laboratory/sampling-type.service";
import {
  SamplingRecordLookupModalComponent
} from "./modal/sampling-record-lookup-modal/sampling-record-lookup-modal.component";

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
    SamplingRecordLookupModalComponent
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


  constructor(private sampleService: SamplesService,
              private measurementUnitService: MeasurementUnitService,
              private adjustmentMethodService: AdjustmentMethodService,
              private samplingTypeService: SamplingTypeService) {
    this.loadSamples();
    this.loadLookups();
  }

  loadLookups(): void {
    this.measurementUnitService.getAll().subscribe(data => this.measurementUnits = data);
    this.adjustmentMethodService.getAll().subscribe(data => this.adjustmentMethods = data);
    this.samplingTypeService.getAll().subscribe(data => this.samplingTypes = data);
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
        alert('❌ Nem sikerült a mintákat betölteni. Ellenőrizd a backendet!');
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

    if (!this.newSample.sampleIdentifier || !this.newSample.samplingRecordId || !this.newSample.status) {
      return;
    }

    const request = this.selectedSampleId
      ? this.sampleService.update(this.selectedSampleId, this.newSample)
      : this.sampleService.create(this.newSample);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadSamples();
      },
      error: () => alert('Hiba a mentés során.')
    });
  }

  onSamplingRecordSelected(record: SamplingRecordDatM200ListItemDTO): void {
    this.selectedSamplingRecord = record;
    this.newSample.samplingRecordId = record.id;
  }

}

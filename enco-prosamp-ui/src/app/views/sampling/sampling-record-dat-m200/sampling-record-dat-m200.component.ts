import {Component, OnInit} from '@angular/core';
import {
  SamplingRecordDatM200Service,
  SamplingRecordRequestDTO,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionModule, ButtonDirective,
  CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, RowComponent, TemplateIdDirective
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {CompanyResponseDTO} from 'src/app/services/partners/company.service';
import {LocationResponseDTO} from "../../../services/partners/location.service";
import {ProjectResponseDTO} from "../../../services/projects/projects.service";
import {EquipmentResponseDTO} from "../../../services/laboratory/equipment.service";
import {CompanyLookupModalComponent} from "./modals/company-lookup-modal/company-lookup-modal.component";
import {LocationLookupModalComponent} from "./modals/location-lookup-modal/location-lookup-modal.component";
import {ProjectLookupModalComponent} from "./modals/project-lookup-modal/project-lookup-modal.component";
import {EquipmentLookupModalComponent} from "./modals/equipment-lookup-modal/equipment-lookup-modal.component";

@Component({
  selector: 'app-sampling-record-dat-m200',
  imports: [
    AccordionModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DatePipe,
    OffcanvasBodyComponent,
    AccordionComponent,
    AccordionItemComponent,
    CompanyLookupModalComponent,
    LocationLookupModalComponent,
    ProjectLookupModalComponent,
    EquipmentLookupModalComponent,
    NgIf,
    NgForOf,
    TemplateIdDirective,
    ButtonDirective,
    OffcanvasHeaderComponent,
    OffcanvasComponent
  ],
  standalone: true,
  templateUrl: './sampling-record-dat-m200.component.html',
  styleUrl: './sampling-record-dat-m200.component.scss'
})
export class SamplingRecordDatM200Component implements OnInit {
  recordList: SamplingRecordResponseDTO[] = [];
  newRecord: SamplingRecordRequestDTO = this.createEmptyRecord();
  selectedRecordId: number | null = null;
  selectedRecordForDetails: SamplingRecordResponseDTO | null = null;

  isModalOpen = false;
  isDrawerOpen = false;
  formValidated = false;

  selectedCompanyName = '';
  selectedLocationName = '';
  selectedProjectName = '';
  selectedEquipmentsDisplay: string[] = [];

  isCompanyModalOpen = false;
  isLocationModalOpen = false;
  isProjectModalOpen = false;
  isEquipmentModalOpen = false;

  constructor(
    private recordService: SamplingRecordDatM200Service,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadRecords();
  }

  createEmptyRecord(): SamplingRecordRequestDTO {
    return {
      samplingDate: '',
      conductedById: '',
      companyId: 0,
      siteLocationId: 0,
      exposureTime: 0,
      projectId: 0,
      status: '',
      equipmentIds: []
    };
  }

  loadRecords(): void {
    this.recordService.getAll().subscribe({
      next: data => this.recordList = data,
      error: err => console.error('Failed to load sampling records', err)
    });
  }

  openModal(record?: SamplingRecordResponseDTO): void {
    if (record) {
      this.selectedRecordId = record.id;
      this.newRecord = {
        samplingDate: record.samplingDate,
        conductedById: record.conductedBy?.id || '',
        companyId: record.company?.id || 0,
        siteLocationId: record.siteLocation?.id || 0,
        testedPlant: record.testedPlant,
        technology: record.technology,
        shiftCountAndDuration: record.shiftCountAndDuration,
        workersPerShift: record.workersPerShift,
        exposureTime: record.exposureTime,
        temperature: record.temperature,
        humidity: record.humidity,
        windSpeed: record.windSpeed,
        pressure1: record.pressure1,
        pressure2: record.pressure2,
        otherEnvironmentalConditions: record.otherEnvironmentalConditions,
        airFlowConditions: record.airFlowConditions,
        operationMode: record.operationMode,
        operationBreak: record.operationBreak,
        localAirExtraction: record.localAirExtraction,
        serialNumbersOfSamples: record.serialNumbersOfSamples,
        projectId: record.project?.id || 0,
        status: record.status,
        remarks: record.remarks,
        equipmentIds: record.samplingRecordEquipments?.map(e => e.id) || []
      };

      this.selectedCompanyName = record.company?.name || '';
      this.selectedLocationName = record.siteLocation?.name || '';
      this.selectedProjectName = record.project?.projectName || '';
      this.selectedEquipmentsDisplay = record.samplingRecordEquipments?.map(e => e.name) || [];
    } else {
      this.selectedRecordId = null;
      this.newRecord = this.createEmptyRecord();
      this.selectedCompanyName = '';
      this.selectedLocationName = '';
      this.selectedProjectName = '';
      this.selectedEquipmentsDisplay = [];
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newRecord.samplingDate || !this.newRecord.conductedById || !this.newRecord.companyId) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedRecordId == null
      ? this.recordService.create(this.newRecord)
      : this.recordService.update(this.selectedRecordId, this.newRecord);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedRecordId ? 'Mintavétel módosítva' : 'Mintavétel létrehozva'
        );
        this.closeModal();
        this.loadRecords();
      },
      error: () => this.notificationService.showError('Mentés sikertelen')
    });
  }

  openDetails(record: SamplingRecordResponseDTO): void {
    this.selectedRecordForDetails = record;
    this.isDrawerOpen = true;
  }

  closeDetails(): void {
    this.selectedRecordForDetails = null;
    this.isDrawerOpen = false;
  }

  onCompanySelected(company: CompanyResponseDTO): void {
    this.newRecord.companyId = company.id;
    this.selectedCompanyName = company.name;
    this.isCompanyModalOpen = false;
  }

  onLocationSelected(location: LocationResponseDTO): void {
    this.newRecord.siteLocationId = location.id;
    this.selectedLocationName = location.name;
    this.isLocationModalOpen = false;
  }

  onProjectSelected(project: ProjectResponseDTO): void {
    this.newRecord.projectId = project.id;
    this.selectedProjectName = project.projectName;
    this.isProjectModalOpen = false;
  }

  onEquipmentsSelected(equipments: EquipmentResponseDTO[]): void {
    this.newRecord.equipmentIds = equipments.map(e => e.id);
    this.selectedEquipmentsDisplay = equipments.map(e => e.name);
    this.isEquipmentModalOpen = false;
  }
}

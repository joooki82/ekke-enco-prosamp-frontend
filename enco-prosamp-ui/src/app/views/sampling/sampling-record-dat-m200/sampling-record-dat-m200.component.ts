import {Component, inject, OnInit} from '@angular/core';
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
  ColComponent, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent,
  OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, RowComponent, TemplateIdDirective
} from "@coreui/angular";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CompanyResponseDTO} from 'src/app/services/partners/company.service';
import {LocationResponseDTO} from "../../../services/partners/location.service";
import {ProjectResponseDTO} from "../../../services/projects/projects.service";
import {EquipmentResponseDTO} from "../../../services/laboratory/equipment.service";
import {
  CompanyLookupModalComponent
} from "../../../shared/lookup-modals/company-lookup-modal/company-lookup-modal.component";
import {
  LocationLookupModalComponent
} from "../../../shared/lookup-modals/location-lookup-modal/location-lookup-modal.component";
import {
  ProjectLookupModalComponent
} from "../../../shared/lookup-modals/project-lookup-modal/project-lookup-modal.component";
import {
  EquipmentLookupModalComponent
} from "../../../shared/lookup-modals/equipment-lookup-modal/equipment-lookup-modal.component";
import {FormsModule} from "@angular/forms";
import Keycloak, {KeycloakProfile} from "keycloak-js";

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
    OffcanvasComponent,
    ModalFooterComponent,
    FormsModule,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './sampling-record-dat-m200.component.html',
  styleUrl: './sampling-record-dat-m200.component.scss'
})
export class SamplingRecordDatM200Component implements OnInit {
  private readonly keycloak = inject(Keycloak);
  public userProfile: KeycloakProfile | null = null;
  public userId: string | undefined = undefined;


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

  filterText = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private recordService: SamplingRecordDatM200Service,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadRecords();
    this.keycloak.loadUserProfile().then(profile => {
      this.userProfile = profile;
      this.userId = this.userProfile?.id;
      console.log(this.userId);
    }).catch(error => {
      this.notificationService.showError(error);
    });
  }

  createEmptyRecord(): SamplingRecordRequestDTO {
    return {
      samplingDate: '',
      conductedById: this.userId || '',
      companyId: 0,
      siteLocationId: 0,
      exposureTime: 0,
      projectId: 0,
      status: 'ACTIVE',
      equipmentIds: []
    };
  }

  loadRecords(): void {
    this.recordService.getAll().subscribe({
      next: data => this.recordList = data,
      error: err => console.error('Nem sikerült betölteni a mintavételi jegyzőkönyveket', err)
    });
  }

  get filteredRecords(): SamplingRecordResponseDTO[] {
    let records = this.recordList;

    if (this.filterText) {
      const text = this.filterText.toLowerCase();
      records = records.filter(r =>
        r.project?.projectName?.toLowerCase().includes(text) ||
        r.company?.name?.toLowerCase().includes(text) ||
        r.siteLocation?.name?.toLowerCase().includes(text) ||
        r.status?.toLowerCase().includes(text) ||
        r.technology?.toLowerCase().includes(text)
      );
    }

    if (this.sortColumn) {
      records = [...records].sort((a, b) => {
        const aValue = this.getSortableValue(a, this.sortColumn);
        const bValue = this.getSortableValue(b, this.sortColumn);

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        return this.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return records;
  }

  getSortableValue(record: SamplingRecordResponseDTO, column: string): string {
    switch (column) {
      case 'project':
        return record.project?.projectName || '';
      case 'company':
        return record.company?.name || '';
      case 'location':
        return record.siteLocation?.name || '';
      case 'status':
        return record.status || '';
      case 'technology':
        return record.technology || '';
      case 'samplingDate':
        return record.samplingDate || '';
      default:
        return '';
    }
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
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
    this.formValidated = true;

    if (!this.isFormValid()) {
      this.notificationService.showError('Kérjük, javítsa a hibákat az űrlapon.');
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

  isFormValid(): boolean {
    const r = this.newRecord;
    return (
      !!r.samplingDate &&
      !!r.status &&
      !!r.companyId &&
      !!r.siteLocationId &&
      !!r.projectId &&
      (!r.humidity || (r.humidity >= 0 && r.humidity <= 100)) &&
      (!r.temperature || (r.temperature >= -100 && r.temperature <= 100)) &&
      (!r.pressure1 || (r.pressure1 >= 800 && r.pressure1 <= 1100)) &&
      (!r.pressure2 || (r.pressure2 >= 800 && r.pressure2 <= 1100))
    );
  }

}

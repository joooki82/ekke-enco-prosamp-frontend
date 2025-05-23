import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormDirective,
  FormFeedbackComponent,
  FormLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  OffcanvasComponent,
  OffcanvasHeaderComponent,
  OffcanvasBodyComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  EquipmentRequestDTO,
  EquipmentResponseDTO,
  EquipmentService
} from "../../../services/laboratory/equipment.service";
import {HasRolesDirective} from "keycloak-angular";

@Component({
  selector: 'app-equipment',
  standalone: true,
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss',
  imports: [
    ColComponent,
    RowComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    OffcanvasComponent,
    OffcanvasHeaderComponent,
    OffcanvasBodyComponent,
    FormsModule,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    NgForOf,
    NgIf,
    DatePipe,
    NgClass,
    HasRolesDirective
  ]
})
export class EquipmentComponent implements OnInit {
  equipmentList: EquipmentResponseDTO[] = [];
  newEquipment: EquipmentRequestDTO = this.createEmptyEquipment();
  selectedEquipmentId: number | null = null;
  selectedEquipmentForDetails: EquipmentResponseDTO | null = null;
  isModalOpen = false;
  isDrawerOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof EquipmentResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private equipmentService: EquipmentService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadEquipment();
  }

  createEmptyEquipment(): EquipmentRequestDTO {
    return {
      name: '',
      identifier: '',
      description: '',
      manufacturer: '',
      type: '',
      serialNumber: '',
      measuringRange: '',
      resolution: '',
      accuracy: '',
      calibrationDate: '',
      nextCalibrationDate: ''
    };
  }

  loadEquipment(): void {
    this.equipmentService.getAll().subscribe({
      next: data => this.equipmentList = data,
      error: err => console.error('Hiba az eszközök betöültésekor', err)
    });
  }

  openModal(equipment?: EquipmentResponseDTO): void {
    if (equipment) {
      this.selectedEquipmentId = equipment.id;
      this.newEquipment = {...equipment};
    } else {
      this.selectedEquipmentId = null;
      this.newEquipment = this.createEmptyEquipment();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  openDetails(equipment: EquipmentResponseDTO): void {
    this.selectedEquipmentForDetails = equipment;
    this.isDrawerOpen = true;
  }

  closeDetails(): void {
    this.selectedEquipmentForDetails = null;
    this.isDrawerOpen = false;
  }

  onSubmit(): void {
    if (!this.newEquipment.name || !this.newEquipment.identifier) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedEquipmentId === null
      ? this.equipmentService.create(this.newEquipment)
      : this.equipmentService.update(this.selectedEquipmentId, this.newEquipment);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedEquipmentId ? 'Eszköz módosítva' : 'Eszköz létrehozva'
        );
        this.closeModal();
        this.loadEquipment();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  get filteredEquipment(): EquipmentResponseDTO[] {
    let filtered = this.equipmentList;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(eq =>
        eq.name.toLowerCase().includes(lower) ||
        eq.identifier.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aValue = (a[column] ?? '').toString().toLowerCase();
        const bValue = (b[column] ?? '').toString().toLowerCase();
        return aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    return filtered;
  }

  toggleSort(column: keyof EquipmentResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}

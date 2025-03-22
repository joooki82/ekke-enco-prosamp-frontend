import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent, FormDirective,
  FormFeedbackComponent,
  FormLabelDirective, ModalBodyComponent, ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {
  LaboratoryRequestDTO,
  LaboratoryResponseDTO,
  LaboratoryService
} from "../../../services/partners/laboratory.service";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-laboratory',
  imports: [
    ColComponent,
    ModalFooterComponent,
    ButtonDirective,
    FormsModule,
    FormFeedbackComponent,
    FormLabelDirective,
    FormDirective,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent,
    NgIf,
    NgForOf,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    RowComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './laboratory.component.html',
  styleUrl: './laboratory.component.scss'
})
export class LaboratoryComponent implements OnInit {
  laboratories: LaboratoryResponseDTO[] = [];
  newLab: LaboratoryRequestDTO = this.createEmptyLab();
  selectedLabId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof LaboratoryResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private laboratoryService: LaboratoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadLabs();
  }

  createEmptyLab(): LaboratoryRequestDTO {
    return {
      name: '',
      accreditation: '',
      contactEmail: '',
      phone: '',
      address: '',
      website: ''
    };
  }

  loadLabs(): void {
    this.laboratoryService.getAll().subscribe({
      next: data => this.laboratories = data,
      error: err => console.error('Failed to load laboratories', err)
    });
  }

  openModal(lab?: LaboratoryResponseDTO): void {
    if (lab) {
      this.selectedLabId = lab.id;
      this.newLab = { ...lab };
    } else {
      this.selectedLabId = null;
      this.newLab = this.createEmptyLab();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newLab.name || !this.newLab.contactEmail) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedLabId === null
      ? this.laboratoryService.create(this.newLab)
      : this.laboratoryService.update(this.selectedLabId, this.newLab);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedLabId ? 'Labor módosítva' : 'Labor létrehozva'
        );
        this.closeModal();
        this.loadLabs();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  get filteredLabs(): LaboratoryResponseDTO[] {
    let filtered = this.laboratories;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.contactEmail?.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aVal = (a[column] ?? '').toString().toLowerCase();
        const bVal = (b[column] ?? '').toString().toLowerCase();
        return aVal.localeCompare(bVal) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    return filtered;
  }

  toggleSort(column: keyof LaboratoryResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}


import {Component, OnInit} from '@angular/core';
import {
  SamplingTypeRequestDTO,
  SamplingTypeResponseDTO,
  SamplingTypeService
} from "../../../services/laboratory/sampling-type.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormDirective,
  FormFeedbackComponent, FormLabelDirective, ModalBodyComponent, ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {HasRolesDirective} from "keycloak-angular";

@Component({
  selector: 'app-sampling-type',
  imports: [
    ModalFooterComponent,
    ButtonDirective,
    FormFeedbackComponent,
    ColComponent,
    FormsModule,
    FormDirective,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent,
    NgIf,
    NgForOf,
    NgClass,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    RowComponent,
    HasRolesDirective,
    FormLabelDirective
  ],
  standalone: true,
  templateUrl: './sampling-type.component.html',
  styleUrl: './sampling-type.component.scss'
})
export class SamplingTypeComponent implements OnInit {
  samplingTypes: SamplingTypeResponseDTO[] = [];
  newSamplingType: SamplingTypeRequestDTO = this.createEmpty();
  selectedId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof SamplingTypeResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private samplingTypeService: SamplingTypeService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.load();
  }

  createEmpty(): SamplingTypeRequestDTO {
    return {
      code: '',
      description: ''
    };
  }

  load(): void {
    this.samplingTypeService.getAll().subscribe({
      next: data => this.samplingTypes = data,
      error: err => console.error('Hiba a mintavételi típusok betöltésekor', err)
    });
  }

  openModal(type?: SamplingTypeResponseDTO): void {
    if (type) {
      this.selectedId = type.id;
      this.newSamplingType = {
        code: type.code,
        description: type.description
      };
    } else {
      this.selectedId = null;
      this.newSamplingType = this.createEmpty();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newSamplingType.code || !this.newSamplingType.description) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedId === null
      ? this.samplingTypeService.create(this.newSamplingType)
      : this.samplingTypeService.update(this.selectedId, this.newSamplingType);

    (action as any).subscribe({
      next: () => {
        this.notificationService.showSuccess(this.selectedId ? 'Típus frissítve' : 'Típus létrehozva');
        this.closeModal();
        this.load();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  toggleSort(column: keyof SamplingTypeResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filtered(): SamplingTypeResponseDTO[] {
    let filtered = this.samplingTypes;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(
        s => s.code.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = (a[this.sortColumn!] ?? '').toString().toLowerCase();
        const bValue = (b[this.sortColumn!] ?? '').toString().toLowerCase();
        return aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    return filtered;
  }
}

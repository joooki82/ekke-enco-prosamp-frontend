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
import {StandardRequestDTO, StandardResponseDTO, StandardService} from "../../../services/laboratory/standard.service";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-standard',
  imports: [
    ColComponent,
    FormLabelDirective,
    FormsModule,
    ModalFooterComponent,
    ButtonDirective,
    FormFeedbackComponent,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent,
    NgClass,
    CardHeaderComponent,
    CardBodyComponent,
    CardComponent,
    RowComponent,
    NgForOf,
    NgIf,
    FormDirective
  ],
  standalone: true,
  templateUrl: './standard.component.html',
  styleUrl: './standard.component.scss'
})
export class StandardComponent implements OnInit {
  standards: StandardResponseDTO[] = [];
  allStandards: StandardResponseDTO[] = [];
  newStandard: StandardRequestDTO = this.createEmptyStandard();
  selectedStandardId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof StandardResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  readonly STANDARD_TYPES = [
    { label: 'Mintavétel', value: 'SAMPLING' },
    { label: 'Vizsgálat', value: 'ANALYSES' }
  ];

  constructor(
    private standardService: StandardService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStandards();
  }

  createEmptyStandard(): StandardRequestDTO {
    return {
      standardNumber: '',
      description: '',
      standardType: '',
      identifier: ''
    };
  }

  loadStandards(): void {
    this.standardService.getAll().subscribe({
      next: data => {
        this.standards = data;
        this.allStandards = data;
      },
      error: err => console.error('Hiba a szabványok lekérésekor', err)
    });
  }

  openModal(standard?: StandardResponseDTO): void {
    if (standard) {
      this.selectedStandardId = standard.id;
      this.newStandard = {
        standardNumber: standard.standardNumber,
        description: standard.description,
        standardType: standard.standardType,
        identifier: standard.identifier
      };
    } else {
      this.selectedStandardId = null;
      this.newStandard = this.createEmptyStandard();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newStandard.standardNumber || !this.newStandard.identifier) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedStandardId === null
      ? this.standardService.create(this.newStandard)
      : this.standardService.update(this.selectedStandardId, this.newStandard);

    (action as any).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedStandardId ? 'Szabvány módosítva' : 'Szabvány létrehozva'
        );
        this.closeModal();
        this.loadStandards();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  toggleSort(column: keyof StandardResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  get filteredStandards(): StandardResponseDTO[] {
    let filtered = this.standards;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(s =>
        s.standardNumber.toLowerCase().includes(lower) ||
        s.identifier.toLowerCase().includes(lower) ||
        (s.description?.toLowerCase().includes(lower) ?? false)
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

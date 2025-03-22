import {Component, OnInit} from '@angular/core';
import {CompanyRequestDTO, CompanyResponseDTO, CompanyService} from "../../../services/partners/company.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent, FormDirective,
  FormFeedbackComponent,
  FormLabelDirective, ModalBodyComponent, ModalComponent,
  ModalFooterComponent, ModalHeaderComponent, RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-company',
  imports: [
    ModalFooterComponent,
    ButtonDirective,
    FormLabelDirective,
    ColComponent,
    FormsModule,
    FormFeedbackComponent,
    ModalBodyComponent,
    FormDirective,
    ModalHeaderComponent,
    ModalComponent,
    NgIf,
    NgForOf,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    RowComponent
  ],
  standalone: true,
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  companies: CompanyResponseDTO[] = [];
  newCompany: CompanyRequestDTO = this.createEmptyCompany();
  selectedCompanyId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof CompanyResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private companyService: CompanyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  createEmptyCompany(): CompanyRequestDTO {
    return {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      city: ''
    };
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: data => this.companies = data,
      error: err => console.error('Failed to load companies', err)
    });
  }

  openModal(company?: CompanyResponseDTO): void {
    if (company) {
      this.selectedCompanyId = company.id;
      this.newCompany = { ...company };
    } else {
      this.selectedCompanyId = null;
      this.newCompany = this.createEmptyCompany();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newCompany.name || !this.newCompany.contactPerson || !this.newCompany.email) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedCompanyId === null
      ? this.companyService.create(this.newCompany)
      : this.companyService.update(this.selectedCompanyId, this.newCompany);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedCompanyId ? 'Cég módosítva' : 'Cég létrehozva'
        );
        this.closeModal();
        this.loadCompanies();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  get filteredCompanies(): CompanyResponseDTO[] {
    let filtered = this.companies;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(lower) ||
        c.contactPerson?.toLowerCase().includes(lower) ||
        c.email?.toLowerCase().includes(lower)
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

  toggleSort(column: keyof CompanyResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}


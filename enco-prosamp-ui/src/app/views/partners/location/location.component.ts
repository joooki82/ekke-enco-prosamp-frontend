import {Component, OnInit} from '@angular/core';
import {LocationRequestDTO, LocationResponseDTO, LocationService} from "../../../services/partners/location.service";
import {CompanyResponseDTO, CompanyService} from "../../../services/partners/company.service";
import {NotificationService} from "../../../services/notification/notification.service";
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
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-location',
  standalone: true,
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
  imports: [
    ModalFooterComponent,
    ButtonDirective,
    FormLabelDirective,
    ColComponent,
    FormsModule,
    FormFeedbackComponent,
    NgForOf,
    ModalBodyComponent,
    FormDirective,
    ModalHeaderComponent,
    ModalComponent,
    CardHeaderComponent,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    NgClass
  ]
})
export class LocationComponent implements OnInit {
  locations: LocationResponseDTO[] = [];
  companies: CompanyResponseDTO[] = [];

  newLocation: LocationRequestDTO = this.createEmptyLocation();
  selectedLocationId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof LocationResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private locationService: LocationService,
    private companyService: CompanyService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadLocations();
    this.loadCompanies();
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: data => this.locations = data,
      error: err => console.error('Nem sikerült betölteni a helyszíneket', err)
    });
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: data => this.companies = data,
      error: err => console.error('Nem sikerült betölteni a cégeket', err)
    });
  }

  createEmptyLocation(): LocationRequestDTO {
    return {
      companyId: 0,
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      postalCode: '',
      address: ''
    };
  }

  openModal(location?: LocationResponseDTO): void {
    if (location) {
      this.selectedLocationId = location.id;
      this.newLocation = {
        companyId: location.company.id,
        name: location.name,
        contactPerson: location.contactPerson,
        email: location.email,
        phone: location.phone,
        address: location.address,
        country: location.country,
        city: location.city,
        postalCode: location.postalCode
      };
    } else {
      this.selectedLocationId = null;
      this.newLocation = this.createEmptyLocation();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newLocation.name || !this.newLocation.contactPerson || !this.newLocation.email || !this.newLocation.companyId) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedLocationId === null
      ? this.locationService.create(this.newLocation)
      : this.locationService.update(this.selectedLocationId, this.newLocation);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedLocationId ? 'Telephely módosítva' : 'Telephely létrehozva'
        );
        this.closeModal();
        this.loadLocations();
      },
      error: () => this.notificationService.showError('Hiba a mentés során')
    });
  }

  get filteredLocations(): LocationResponseDTO[] {
    let filtered = this.locations;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.contactPerson?.toLowerCase().includes(lower)
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

  toggleSort(column: keyof LocationResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}

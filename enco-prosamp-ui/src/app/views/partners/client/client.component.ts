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
  ModalComponent, ModalFooterComponent,
  ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {ClientRequestDTO, ClientResponseDTO, ClientService} from "../../../services/partners/client.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-client',
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
    FormsModule,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    ModalFooterComponent,
    NgForOf,
    NgIf,
    NgClass
  ],
  standalone: true,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit {
  clients: ClientResponseDTO[] = [];
  newClient: ClientRequestDTO = this.createEmptyClient();
  selectedClientId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';
  sortColumn: keyof ClientResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';



  constructor(
    private clientService: ClientService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  createEmptyClient(): ClientRequestDTO {
    return {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      city: '',
      postalCode: '',
      taxNumber: ''
    };
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: data => this.clients = data,
      error: err => console.error('Failed to load clients', err)
    });
  }

  openModal(client?: ClientResponseDTO): void {
    if (client) {
      this.selectedClientId = client.id;
      this.newClient = { ...client };
    } else {
      this.selectedClientId = null;
      this.newClient = this.createEmptyClient();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newClient.name || !this.newClient.contactPerson || !this.newClient.email) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedClientId === null
      ? this.clientService.create(this.newClient)
      : this.clientService.update(this.selectedClientId, this.newClient);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedClientId ? 'Megbízó módosítva' : 'Megbízó létrehozva'
        );
        this.closeModal();
        this.loadClients();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  get filteredClients(): ClientResponseDTO[] {
    let filtered = this.clients;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(lower) ||
        client.contactPerson?.toLowerCase().includes(lower) ||
        client.email?.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aValue = (a[column] ?? '').toString().toLowerCase();
        const bValue = (b[column] ?? '').toString().toLowerCase();

        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  toggleSort(column: keyof ClientResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

}

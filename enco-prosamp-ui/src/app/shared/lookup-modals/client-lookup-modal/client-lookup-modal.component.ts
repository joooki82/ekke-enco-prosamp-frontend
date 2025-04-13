import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective, ModalComponent, ModalHeaderComponent, ModalBodyComponent,
  ModalFooterComponent
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import {ClientResponseDTO, ClientService} from "../../../services/partners/client.service";

@Component({
  selector: 'app-client-lookup-modal',
  standalone: true,
  templateUrl: './client-lookup-modal.component.html',
  styleUrl: './client-lookup-modal.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,
    ButtonDirective
  ]
})
export class ClientLookupModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() clientSelected = new EventEmitter<ClientResponseDTO>();

  clients: ClientResponseDTO[] = [];
  filter: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: data => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        this.clients = this.filter
          ? sorted.filter(client => client.name.toLowerCase().includes(this.filter.toLowerCase()))
          : sorted;
      },
      error: err => console.error('Hiba az ügyfelek lekérdezésekor', err)
    });
  }

  onSearchInput(): void {
    this.loadClients();
  }

  selectClient(client: ClientResponseDTO): void {
    this.clientSelected.emit(client);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

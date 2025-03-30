import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocationResponseDTO, LocationService} from "../../../services/partners/location.service";
import {
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-location-lookup-modal',
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    FormsModule,
    NgForOf,
    ModalFooterComponent,
    ButtonDirective
  ],
  templateUrl: './location-lookup-modal.component.html',
  styleUrl: './location-lookup-modal.component.scss'
})
export class LocationLookupModalComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() locationSelected = new EventEmitter<LocationResponseDTO>();

  locations: LocationResponseDTO[] = [];
  filter = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: data => {
        this.locations = data.filter(l => !this.filter || l.name.toLowerCase().includes(this.filter.toLowerCase()));
      },
      error: err => console.error('Location fetch failed', err)
    });
  }

  select(location: LocationResponseDTO): void {
    this.locationSelected.emit(location);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

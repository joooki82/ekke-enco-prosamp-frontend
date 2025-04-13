import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EquipmentResponseDTO, EquipmentService} from "../../../services/laboratory/equipment.service";
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
  selector: 'app-equipment-lookup-modal',
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    FormsModule,
    NgForOf,
    ModalFooterComponent,
    ButtonDirective
  ],
  templateUrl: './equipment-lookup-modal.component.html',
  styleUrl: './equipment-lookup-modal.component.scss'
})
export class EquipmentLookupModalComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() equipmentsSelected = new EventEmitter<EquipmentResponseDTO[]>();

  equipmentList: EquipmentResponseDTO[] = [];
  selectedIds = new Set<number>();
  filter = '';

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadEquipments();
  }

  loadEquipments(): void {
    this.equipmentService.getAll().subscribe({
      next: data => {
        this.equipmentList = data.filter(e => !this.filter || e.name.toLowerCase().includes(this.filter.toLowerCase()));
      },
      error: err => console.error('Hiba az eszközök lekérésekor', err)
    });
  }

  toggleSelection(id: number): void {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  confirmSelection(): void {
    const selected = this.equipmentList.filter(e => this.selectedIds.has(e.id));
    this.equipmentsSelected.emit(selected);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

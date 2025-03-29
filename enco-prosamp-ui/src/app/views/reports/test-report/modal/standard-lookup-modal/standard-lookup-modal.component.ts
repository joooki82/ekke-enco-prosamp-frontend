import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent, ModalBodyComponent, ModalComponent,
  ModalFooterComponent, ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-standard-lookup-modal',
  imports: [
    ModalFooterComponent,
    ButtonDirective,
    NgIf,
    NgForOf,
    CardBodyComponent,
    CardComponent,
    FormsModule,
    ColComponent,
    RowComponent,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent
  ],
  standalone: true,
  templateUrl: './standard-lookup-modal.component.html',
  styleUrl: './standard-lookup-modal.component.scss'
})
export class StandardLookupModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() selectedStandards = new EventEmitter<number[]>();

  filterText: string = '';
  standards: { id: number; name: string }[] = [];
  selectedStandardIds: Set<number> = new Set<number>();

  ngOnInit(): void {
    this.loadStandards();
  }

  loadStandards(): void {
    // Simulated data, replace with actual API call
    this.standards = [
      { id: 1, name: 'ISO 9001' },
      { id: 2, name: 'ISO 14001' },
      { id: 3, name: 'ISO 17025' },
      { id: 4, name: 'ISO 45001' },
    ];
  }

  toggleSelection(id: number): void {
    if (this.selectedStandardIds.has(id)) {
      this.selectedStandardIds.delete(id);
    } else {
      this.selectedStandardIds.add(id);
    }
  }

  submitSelection(): void {
    this.selectedStandards.emit(Array.from(this.selectedStandardIds));
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }
}

import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
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
import {StandardResponseDTO, StandardService} from "../../../services/laboratory/standard.service";

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
  @Input() preselectedStandardIds: number[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectedStandards = new EventEmitter<number[]>();

  filterText: string = '';
  standards: StandardResponseDTO[] = [];
  selectedStandardIds: Set<number> = new Set<number>();

  constructor(private standardService: StandardService) {}

  ngOnInit(): void {
    this.loadStandards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedStandardIds'] && this.preselectedStandardIds) {
      this.selectedStandardIds = new Set(this.preselectedStandardIds);
    }
  }

  loadStandards(): void {
    this.standardService.getAll().subscribe({
      next: (data) => {
        this.standards = data;
      },
      error: (err) => {
        console.error('Error fetching standards:', err);
      }
    });
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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {UserDTO, UserService} from "../../../../../services/user/user.service";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent, ModalFooterComponent,
  ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-sampler-lookup-modal',
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    RowComponent,
    ColComponent,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    NgForOf,
    NgIf
  ],
  standalone: true,
  templateUrl: './sampler-lookup-modal.component.html',
  styleUrl: './sampler-lookup-modal.component.scss'
})
export class SamplerLookupModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() preselectedSamplerIds: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectedSamplers = new EventEmitter<string[]>();

  filterText: string = '';
  samplers: UserDTO[] = [];
  selectedSamplerIds: Set<string> = new Set<string>();

  constructor(private samplerService: UserService) {}

  ngOnInit(): void {
    this.loadSamplers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedSamplerIds'] && this.preselectedSamplerIds) {
      this.selectedSamplerIds = new Set(this.preselectedSamplerIds);
    }
  }

  loadSamplers(): void {
    this.samplerService.getAll().subscribe({
      next: (data) => {
        this.samplers = data;
        console.log('Samplers loaded:', this.samplers);
      },
      error: (err) => {
        console.error('Error fetching samplers:', err);
      }
    });
  }

  toggleSelection(id: string): void {
    if (this.selectedSamplerIds.has(id)) {
      this.selectedSamplerIds.delete(id);
    } else {
      this.selectedSamplerIds.add(id);
    }
  }

  submitSelection(): void {
    this.selectedSamplers.emit(Array.from(this.selectedSamplerIds));
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }
}

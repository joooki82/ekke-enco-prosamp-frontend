import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {UserDTO, UserService} from "../../../services/user/user.service";
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
  @Output() selectedSamplers = new EventEmitter<{ id: string, lastName: string }[]>();

  filterText: string = '';
  samplers: UserDTO[] = [];
  selectedSamplerIds: Set<string> = new Set<string>();
  selectedSamplerMap: Map<string, string> = new Map<string, string>();

  constructor(private samplerService: UserService) {
  }

  ngOnInit(): void {
    this.loadSamplers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectedSamplerIds'] && this.preselectedSamplerIds) {
      this.selectedSamplerIds = new Set(this.preselectedSamplerIds);

      if (this.samplers.length > 0) {
        this.populateSamplerMap();
      } else {
        this.loadSamplers(true);
      }
    }
  }

  loadSamplers(preserveSelection = false): void {
    this.samplerService.getAll().subscribe({
      next: (data) => {
        this.samplers = data;
        console.log('Mintavevők:', this.samplers);
        if (preserveSelection) {
          this.populateSamplerMap();
        }
      },
      error: (err) => {
        console.error('Hiba a mintavevők lekérésekor:', err);
      }
    });
  }

  populateSamplerMap(): void {
    this.preselectedSamplerIds.forEach(id => {
      const found = this.samplers.find(s => s.id === id);
      if (found) {
        this.selectedSamplerMap.set(found.id, found.lastName);
      }
    });
  }

  toggleSelection(sampler: UserDTO): void {
    if (this.selectedSamplerIds.has(sampler.id)) {
      this.selectedSamplerIds.delete(sampler.id);
      this.selectedSamplerMap.delete(sampler.id);
    } else {
      this.selectedSamplerIds.add(sampler.id);
      this.selectedSamplerMap.set(sampler.id, sampler.lastName);
    }
  }


  submitSelection(): void {
    const selectedSamplers = Array.from(this.selectedSamplerIds).map(id => ({
      id,
      lastName: this.selectedSamplerMap.get(id) || ''
    }));
    this.selectedSamplers.emit(selectedSamplers);
    this.close.emit();
  }


  cancel(): void {
    this.close.emit();
  }


}

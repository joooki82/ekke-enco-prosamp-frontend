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
  @Output() selectedSamplers = new EventEmitter<{ id: string, username: string }[]>();

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
        this.preselectedSamplerIds.forEach(id => {
          const foundSampler = this.samplers.find(s => s.id === id);
          if (foundSampler) {
            this.selectedSamplerMap.set(foundSampler.id, foundSampler.username);
          }
        });
      } else {
        this.loadSamplers();
      }
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

  toggleSelection(sampler: UserDTO): void {
    if (this.selectedSamplerIds.has(sampler.id)) {
      this.selectedSamplerIds.delete(sampler.id);
      this.selectedSamplerMap.delete(sampler.id);
    } else {
      this.selectedSamplerIds.add(sampler.id);
      this.selectedSamplerMap.set(sampler.id, sampler.username);
    }
  }


  submitSelection(): void {
    const selectedSamplers = Array.from(this.selectedSamplerIds).map(id => ({
      id,
      username: this.selectedSamplerMap.get(id) || ''
    }));
    this.selectedSamplers.emit(selectedSamplers);
    this.close.emit();
  }


  cancel(): void {
    this.close.emit();
  }






}

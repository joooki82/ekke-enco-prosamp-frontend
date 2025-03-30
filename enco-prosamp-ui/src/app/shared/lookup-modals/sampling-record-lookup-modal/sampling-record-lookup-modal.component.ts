import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  SamplingRecordDatM200Service,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent, ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent, RowComponent
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-sampling-record-lookup-modal',
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    NgIf,
    NgForOf,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    DatePipe
  ],
  standalone: true,
  templateUrl: './sampling-record-lookup-modal.component.html',
  styleUrl: './sampling-record-lookup-modal.component.scss'
})
export class SamplingRecordLookupModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() selected = new EventEmitter<SamplingRecordResponseDTO>();

  filterText: string = '';
  records: SamplingRecordResponseDTO[] = [];

  constructor(private recordService: SamplingRecordDatM200Service) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.recordService.getAll().subscribe(data => this.records = data);
  }

  get filteredRecords(): SamplingRecordResponseDTO[] {
    const term = this.filterText.toLowerCase();
    return this.records.filter(r =>
      r.project?.projectName?.toLowerCase().includes(term) ||
      r.company?.name?.toLowerCase().includes(term) ||
      r.siteLocation?.name?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term) ||
      r.samplingDate?.toLowerCase().includes(term)
    );
  }

  select(record: SamplingRecordResponseDTO): void {
    this.selected.emit(record);
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }
}

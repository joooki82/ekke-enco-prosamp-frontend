import {Component, NgZone, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  SampleListItemDTO,
  SamplingRecordDatM200Service,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";
import {SamplesService} from "../../../services/sampling/samples.service";
import {ContaminantResponseDTO, ContaminantService} from "../../../services/laboratory/contaminant.service";
import {
  ContaminantGroupResponseDTO,
  ContaminantGroupService
} from "../../../services/laboratory/contaminant-group.service";
import {
  SampleContaminantLinkService,
  SampleContaminantRequestDTO
} from "../../../services/analytics/sample-contaminant-link.service";
import {forkJoin} from "rxjs";
import {
  SamplingRecordLookupModalComponent
} from "../../../shared/lookup-modals/sampling-record-lookup-modal/sampling-record-lookup-modal.component";

@Component({
  selector: 'app-sample-contaminant-link',
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    DatePipe,
    SamplingRecordLookupModalComponent
  ],
  standalone: true,
  templateUrl: './sample-contaminant-link.component.html',
  styleUrl: './sample-contaminant-link.component.scss'
})
export class SampleContaminantLinkComponent implements OnInit {
  samplingRecords: SamplingRecordResponseDTO[] = [];
  selectedSamplingRecordId: number | null = null;
  selectedSamplingRecord: SamplingRecordResponseDTO | null = null;

  samples: SampleListItemDTO[] = [];
  contaminants: ContaminantResponseDTO[] = [];
  contaminantGroups: ContaminantGroupResponseDTO[] = [];

  selectedContaminants: { [sampleId: number]: Set<number> } = {};
  initialContaminants: { [sampleId: number]: Set<number> } = {};
  readySampleIds: Set<number> = new Set<number>();

  showModal: boolean = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private samplingRecordService: SamplingRecordDatM200Service,
    private sampleService: SamplesService,
    private contaminantService: ContaminantService,
    private contaminantGroupService: ContaminantGroupService,
    private sampleContaminantLinkService: SampleContaminantLinkService
  ) {}

  ngOnInit(): void {
    this.loadSamplingRecords();
    this.loadContaminants();
    this.loadContaminantGroups();
  }

  loadSamplingRecords(): void {
    this.samplingRecordService.getAll().subscribe(records => {
      this.samplingRecords = records;
    });
  }

  openSamplingRecordModal(): void {
    this.showModal = true;
  }

  onSamplingRecordSelected(record: SamplingRecordResponseDTO): void {
    this.selectedSamplingRecordId = record.id;
    this.selectedSamplingRecord = record;
    this.showModal = false;
    this.loadSamplesForRecord(record.id);
  }

  onSamplingRecordChange(): void {
    if (this.selectedSamplingRecordId) {
      this.loadSamplesForRecord(this.selectedSamplingRecordId);
    }
  }

  loadSamplesForRecord(samplingRecordId: number): void {
    this.selectedContaminants = {};
    this.initialContaminants = {};
    this.readySampleIds = new Set<number>();

    this.samplingRecordService.get(samplingRecordId).subscribe(record => {
      this.samples = record.samples.map(s => ({
        id: s.id,
        samplingRecordId: s.samplingRecordId,
        sampleIdentifier: s.sampleIdentifier,
        location: s.location,
        employeeName: s.employeeName,
        startTime: s.startTime,
        endTime: s.endTime
      }));

      const requests = this.samples.map(sample => ({
        sampleId: sample.id,
        request$: this.sampleContaminantLinkService.getContaminantsBySample(sample.id)
      }));

      forkJoin(requests.map(r => r.request$)).subscribe((results) => {
        results.forEach((linked, index) => {
          const sampleId = requests[index].sampleId;
          const contaminantIds = linked?.contaminants?.map(c => c.id) ?? [];

          this.initialContaminants[sampleId] = new Set(contaminantIds);
          this.selectedContaminants[sampleId] = new Set(contaminantIds);

          const updated = new Set(this.readySampleIds);
          updated.add(sampleId);
          this.readySampleIds = updated;
        });
      });
    });
  }

  loadContaminants(): void {
    this.contaminantService.getAll().subscribe(data => this.contaminants = data);
  }

  loadContaminantGroups(): void {
    this.contaminantGroupService.getAll().subscribe(data => this.contaminantGroups = data);
  }

  toggleContaminant(sampleId: number, contaminantId: number, isChecked: boolean): void {
    const selectedSet = this.selectedContaminants[sampleId] ?? new Set<number>();

    if (isChecked) {
      selectedSet.add(contaminantId);
    } else {
      selectedSet.delete(contaminantId);
    }

    this.selectedContaminants[sampleId] = new Set(selectedSet); // trigger change detection
  }

  assignGroup(sampleId: number, groupId: number): void {
    const group = this.contaminantGroups.find(g => g.id === groupId);
    if (!group) return;

    const selectedSet = new Set(this.selectedContaminants[sampleId] ?? []);
    group.contaminants.forEach(c => selectedSet.add(c.id));
    this.selectedContaminants[sampleId] = selectedSet;
  }

  removeGroup(sampleId: number, groupId: number): void {
    const group = this.contaminantGroups.find(g => g.id === groupId);
    if (!group) return;

    const selectedSet = new Set(this.selectedContaminants[sampleId] ?? []);
    group.contaminants.forEach(c => selectedSet.delete(c.id));
    this.selectedContaminants[sampleId] = selectedSet;
  }

  saveAssignments(): void {
    const payloadToLink: SampleContaminantRequestDTO[] = [];
    const payloadToUnlink: SampleContaminantRequestDTO[] = [];

    for (const [sampleIdStr, selectedSet] of Object.entries(this.selectedContaminants)) {
      const sampleId = Number(sampleIdStr);
      const initialSet = this.initialContaminants[sampleId] ?? new Set<number>();

      for (const id of selectedSet) {
        if (!initialSet.has(id)) {
          payloadToLink.push({ sampleId, contaminantId: id });
        }
      }

      for (const id of initialSet) {
        if (!selectedSet.has(id)) {
          payloadToUnlink.push({ sampleId, contaminantId: id });
        }
      }
    }

    this.isLoading = true;

    const linkRequests = payloadToLink.map(dto => this.sampleContaminantLinkService.linkContaminant(dto));
    const unlinkRequests = payloadToUnlink.map(dto => this.sampleContaminantLinkService.unlinkContaminant(dto));

    Promise.all([
      ...linkRequests.map(r => r.toPromise()),
      ...unlinkRequests.map(r => r.toPromise())
    ])
      .then(() => {
        this.isLoading = false;
        alert('Contaminant links updated successfully.');
      })
      .catch(err => {
        this.isLoading = false;
        this.error = 'Error saving assignments.';
        console.error(err);
      });
  }
}

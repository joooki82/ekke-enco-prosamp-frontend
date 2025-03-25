import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {
  SamplingRecordDatM200Service,
  SamplingRecordResponseDTO
} from "../../../services/sampling/sampling-record-dat-m200.service";
import {SampleResponseDTO, SamplesService} from "../../../services/sampling/samples.service";
import {ContaminantResponseDTO, ContaminantService} from "../../../services/laboratory/contaminant.service";
import {
  ContaminantGroupResponseDTO,
  ContaminantGroupService
} from "../../../services/laboratory/contaminant-group.service";
import {
  SampleContaminantLinkService,
  SampleContaminantRequestDTO
} from "../../../services/analytics/sample-contaminant-link.service";

@Component({
  selector: 'app-sample-contaminant-link',
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    DatePipe
  ],
  standalone: true,
  templateUrl: './sample-contaminant-link.component.html',
  styleUrl: './sample-contaminant-link.component.scss'
})
export class SampleContaminantLinkComponent implements OnInit {
  samplingRecords: SamplingRecordResponseDTO[] = [];
  selectedSamplingRecordId: number | null = null;
  samples: SampleResponseDTO[] = [];

  contaminants: ContaminantResponseDTO[] = [];
  contaminantGroups: ContaminantGroupResponseDTO[] = [];

  selectedContaminants: { [sampleId: number]: Set<number> } = {};

  isLoading = false;
  error: string | null = null;

  constructor(
    private samplingRecordService: SamplingRecordDatM200Service,
    private sampleService: SamplesService,
    private contaminantService: ContaminantService,
    private contaminantGroupService: ContaminantGroupService,
    private sampleContaminantLinkService: SampleContaminantLinkService
  ) {
  }

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

  onSamplingRecordChange(): void {
    if (!this.selectedSamplingRecordId) return;
    this.sampleService.getAll().subscribe(samples => {
      this.samples = samples.filter(s => s.samplingRecord.id === this.selectedSamplingRecordId);
      this.selectedContaminants = {};
      this.samples.forEach(s => this.selectedContaminants[s.id] = new Set());
    });
  }

  loadContaminants(): void {
    this.contaminantService.getAll().subscribe(data => this.contaminants = data);
  }

  loadContaminantGroups(): void {
    this.contaminantGroupService.getAll().subscribe(data => this.contaminantGroups = data);
  }

  toggleContaminant(sampleId: number, contaminantId: number, isChecked: boolean): void {
    const selectedSet = this.selectedContaminants[sampleId] || new Set<number>();
    isChecked ? selectedSet.add(contaminantId) : selectedSet.delete(contaminantId);
    this.selectedContaminants[sampleId] = selectedSet;
  }

  assignGroup(sampleId: number, groupId: number): void {
    const group = this.contaminantGroups.find(g => g.id === groupId);
    if (!group) return;
    group.contaminants.forEach(c => this.selectedContaminants[sampleId].add(c.id));
  }

  removeGroup(sampleId: number, groupId: number): void {
    const group = this.contaminantGroups.find(g => g.id === groupId);
    if (!group) return;
    group.contaminants.forEach(c => this.selectedContaminants[sampleId].delete(c.id));
  }

  saveAssignments(): void {
    const payload: SampleContaminantRequestDTO[] = [];

    for (const [sampleId, contaminantSet] of Object.entries(this.selectedContaminants)) {
      for (const contaminantId of contaminantSet) {
        payload.push({
          sampleId: Number(sampleId),
          contaminantId: contaminantId
        });
      }
    }

    this.isLoading = true;
    this.error = null;

    // Send requests one-by-one in parallel (could be optimized into a bulk endpoint later)
    const requests = payload.map(dto => this.sampleContaminantLinkService.linkContaminant(dto));

    // Execute all in parallel
    Promise.all(requests.map(req => req.toPromise()))
      .then(() => {
        this.isLoading = false;
        alert('Contaminants successfully linked to samples.');
      })
      .catch(error => {
        this.isLoading = false;
        this.error = 'Error linking contaminants to samples.';
        console.error(error);
      });
  }
}

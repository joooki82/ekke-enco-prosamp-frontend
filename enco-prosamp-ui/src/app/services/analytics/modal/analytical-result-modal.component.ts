// analytical-result-modal.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SampleListItemDTO} from "../../sampling/sampling-record-dat-m200.service";
import {SampleContaminantListItem2DTO} from "../sample-contaminant-link.service";
import {SampleAnalyticalResultRequestDTO} from "../sample-analytical-result.service";
import {MeasurementUnitResponseDTO} from "../../laboratory/measurement-unit.service";
import {AnalyticalLabReportResponseDTO} from "../../reports/analytical-lab-report.service";

@Component({
  selector: 'app-analytical-result-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytical-result-modal.component.html'
})
export class AnalyticalResultModalComponent {
  @Input() sample!: SampleListItemDTO;
  @Input() data!: {
    contaminants: SampleContaminantListItem2DTO[],
    results: Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>
  };

  @Input() measurementUnits: MeasurementUnitResponseDTO[] = [];
  @Input() labReports: AnalyticalLabReportResponseDTO[] = [];

  @Output() save = new EventEmitter<Map<number, SampleAnalyticalResultRequestDTO & { id?: number }>>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.data.results);
  }

  onCancel() {
    this.close.emit();
  }
}

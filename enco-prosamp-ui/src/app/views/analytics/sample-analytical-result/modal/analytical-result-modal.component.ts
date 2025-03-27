// analytical-result-modal.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SampleListItemDTO} from "../../../../services/sampling/sampling-record-dat-m200.service";
import {SampleContaminantListItem2DTO} from "../../../../services/analytics/sample-contaminant-link.service";
import {SampleAnalyticalResultRequestDTO} from "../../../../services/analytics/sample-analytical-result.service";
import {MeasurementUnitResponseDTO} from "../../../../services/laboratory/measurement-unit.service";
import {AnalyticalLabReportResponseDTO} from "../../../../services/reports/analytical-lab-report.service";

@Component({
  selector: 'app-analytical-result-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytical-result-modal.component.html',
  styleUrls: ['./analytical-result-modal.component.scss'] // ✅ MUST INCLUDE THIS
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
  @Output() autosave = new EventEmitter<SampleAnalyticalResultRequestDTO & { id?: number }>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit(this.data.results);
  }

  onCancel() {
    this.close.emit();
  }

  onAutoSave() {
    for (const result of this.data.results.values()) {
      this.autosave.emit(result); // emit each change individually
    }
  }


  onNDChange(result: SampleAnalyticalResultRequestDTO & { id?: number }) {
    if (result.isBelowDetectionLimit) {
      result.resultMain = 0;
      result.resultControl = 0;
      result.resultMainControl = 0;
    }

    this.onAutoSave();
  }

}

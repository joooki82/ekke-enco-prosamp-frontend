import {Component, OnInit} from '@angular/core';
import {
  AnalyticalLabReportRequestDTO,
  AnalyticalLabReportResponseDTO, AnalyticalLabReportService
} from "../../../services/reports/analytical-lab-report.service";
import {LaboratoryResponseDTO, LaboratoryService} from "../../../services/partners/laboratory.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent, FormDirective,
  FormFeedbackComponent, FormLabelDirective, ModalBodyComponent, ModalComponent,
  ModalFooterComponent, ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-analytical-lab-report',
  imports: [
    ModalFooterComponent,
    FormFeedbackComponent,
    ColComponent,
    FormsModule,
    RowComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    NgForOf,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    FormDirective,
    FormLabelDirective,
    ButtonDirective
  ],
  standalone: true,
  templateUrl: './analytical-lab-report.component.html',
  styleUrl: './analytical-lab-report.component.scss'
})
export class AnalyticalLabReportComponent implements OnInit {
  reports: AnalyticalLabReportResponseDTO[] = [];
  laboratories: LaboratoryResponseDTO[] = [];
  filterText: string = '';


  newReport: AnalyticalLabReportRequestDTO = this.createEmptyReport();
  selectedReportId: number | null = null;
  isModalOpen = false;
  formValidated = false;

  constructor(
    private reportService: AnalyticalLabReportService,
    private laboratoryService: LaboratoryService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadReports();
    this.loadLaboratories();
  }

  loadReports(): void {
    this.reportService.getAll().subscribe({
      next: data => this.reports = data,
      error: err => console.error('Nem sikerült betölteni a jegyzőkönyveket', err)
    });
  }

  loadLaboratories(): void {
    this.laboratoryService.getAll().subscribe({
      next: data => this.laboratories = data,
      error: err => console.error('Nem sikerült betölteni a laboratóriumokat', err)
    });
  }

  createEmptyReport(): AnalyticalLabReportRequestDTO {
    return {
      reportNumber: '',
      issueDate: '',
      laboratoryId: 0
    };
  }

  openModal(report?: AnalyticalLabReportResponseDTO): void {
    if (report) {
      this.selectedReportId = report.id;
      this.newReport = {
        reportNumber: report.reportNumber,
        issueDate: report.issueDate,
        laboratoryId: report.laboratory.id
      };
    } else {
      this.selectedReportId = null;
      this.newReport = this.createEmptyReport();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newReport.reportNumber || !this.newReport.issueDate || !this.newReport.laboratoryId) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedReportId == null
      ? this.reportService.create(this.newReport)
      : this.reportService.update(this.selectedReportId, this.newReport);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedReportId ? 'Jegyzőkönyv frissítve' : 'Jegyzőkönyv létrehozva'
        );
        this.closeModal();
        this.loadReports();
      },
      error: () => this.notificationService.showError('Hiba a mentés során')
    });
  }

  get filteredReports(): AnalyticalLabReportResponseDTO[] {
    if (!this.filterText) return this.reports;

    const lower = this.filterText.toLowerCase();
    return this.reports.filter(report =>
      report.reportNumber.toLowerCase().includes(lower) ||
      report.issueDate.toLowerCase().includes(lower) ||
      report.laboratory.name.toLowerCase().includes(lower)
    );
  }

}

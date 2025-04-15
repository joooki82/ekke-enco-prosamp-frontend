import {Component, OnInit} from '@angular/core';
import {
  TestReportRequestDTO,
  TestReportResponseDTO,
  TestReportService
} from "../../../services/reports/testreport.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormDirective,
  FormFeedbackComponent,
  FormLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  RowComponent,
} from "@coreui/angular";
import {FormsModule, NgForm} from "@angular/forms";
import {
  SamplingRecordLookupModalComponent
} from "../../../shared/lookup-modals/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {
  StandardLookupModalComponent
} from "../../../shared/lookup-modals/standard-lookup-modal/standard-lookup-modal.component";
import {
  SamplerLookupModalComponent
} from "../../../shared/lookup-modals/sampler-lookup-modal/sampler-lookup-modal.component";

@Component({
  selector: 'app-test-report',
  imports: [
    ColComponent,
    ButtonDirective,
    FormsModule,
    FormLabelDirective,
    ModalBodyComponent,
    FormDirective,
    ModalHeaderComponent,
    ModalComponent,
    SamplingRecordLookupModalComponent,
    FormFeedbackComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    NgClass,
    NgForOf,
    NgIf,
    DatePipe,
    StandardLookupModalComponent,
    ModalFooterComponent,
    SamplerLookupModalComponent
  ],
  standalone: true,
  templateUrl: './test-report.component.html',
  styleUrl: './test-report.component.scss'
})
export class TestReportComponent implements OnInit {
  reports: TestReportResponseDTO[] = [];
  newReport: TestReportRequestDTO;
  selectedReportId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText: string = '';
  sortColumn: keyof TestReportResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  isSamplingRecordLookupOpen = false;
  selectedSamplingRecord: any = null;
  isStandardLookupOpen = false;
  isSamplerLookupOpen = false;
  selectedSamplerNames: string[] = [];
  isGeneratingReport: boolean = false;


  constructor(
    private testReportService: TestReportService,
    private notificationService: NotificationService
  ) {
    this.newReport = this.createEmptyReport();
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.testReportService.getAll().subscribe({
      next: data => this.reports = data,
      error: err => console.error('Nem sikerült betölteni a jelentéseket', err)
    });
  }

  createEmptyReport(): TestReportRequestDTO {
    return {
      reportNumber: '',
      title: '',
      approvedBy: '86259e24-8c83-4250-bd69-44e867701160',
      preparedBy: 'de3d9cb1-6095-430e-9d2a-ccc5648f8fa1',
      checkedBy: '67b8b432-d9e6-479d-8e2f-da6742b8618f',
      projectId: 0,
      locationId: 0,
      samplingRecordId: 0,
      issueDate: '',
      reportStatus: 'DRAFT',
      testReportStandardIds: [],
      testReportSamplerIds: [],
      aimOfTest: '',
      technology: '',
      samplingConditionsDates: '',
      determinationOfPollutantConcentration: ''
    };
  }

  mapToRequestDTO(response: TestReportResponseDTO): TestReportRequestDTO {
    return {
      reportNumber: response.reportNumber,
      title: response.title,
      approvedBy: response.approvedBy?.id || '',
      preparedBy: response.preparedBy?.id || '',
      checkedBy: response.checkedBy?.id || '',
      projectId: response.project?.id || 0,
      locationId: response.location?.id || 0,
      samplingRecordId: response.samplingRecord?.id || 0,
      issueDate: response.issueDate,
      reportStatus: response.reportStatus,
      testReportStandardIds: response.testReportStandards?.map(s => s.id) || [],
      testReportSamplerIds: response.testReportSamplers?.map(s => s.id) || [],
      aimOfTest: response.aimOfTest,
      technology: response.technology,
      samplingConditionsDates: response.samplingConditionsDates,
      determinationOfPollutantConcentration: response.determinationOfPollutantConcentration
    };
  }

  openModal(report?: TestReportResponseDTO): void {
    if (report) {
      this.selectedReportId = report.id;
      this.newReport = this.mapToRequestDTO(report);
      this.selectedSamplingRecord = report.samplingRecord;

      this.selectedSamplerNames = report.testReportSamplers?.map(sampler => sampler.lastName) || [];
    } else {
      this.selectedReportId = null;
      this.newReport = this.createEmptyReport();
      this.selectedSamplerNames = [];
      this.selectedSamplingRecord = null;
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.formValidated = true;
      this.notificationService.showError('Kérjük, töltse ki az összes kötelező mezőt!');
      return;
    }

    const action = this.selectedReportId === null
      ? this.testReportService.create(this.newReport)
      : this.testReportService.update(this.selectedReportId, this.newReport);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedReportId ? 'A jegyzőkönyv sikeresen frissítve' : 'A jelentés sikeresen létrjött'
        );
        this.closeModal();
        this.loadReports();
      },
      error: (err) => {
        console.error('Error during save:', err);
        this.notificationService.showError('Hiba történt a mentés során');
      }
    });
  }

  get filteredReports(): TestReportResponseDTO[] {
    let filtered = this.reports;
    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(r =>
        r.reportNumber.toLowerCase().includes(lower) ||
        r.title?.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aVal = (a[column] ?? '').toString().toLowerCase();
        const bVal = (b[column] ?? '').toString().toLowerCase();
        return aVal.localeCompare(bVal) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    return filtered;
  }

  toggleSort(column: keyof TestReportResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  openSamplingRecordLookup() {
    this.isSamplingRecordLookupOpen = true;
  }

  onSamplingRecordSelected(record: any) {
    this.newReport.samplingRecordId = record.id;
    if (record.project && record.project.id) {
      this.newReport.projectId = record.project.id;
    }
    if (record.siteLocation && record.siteLocation.id) {
      this.newReport.locationId = record.siteLocation.id;
    }
    this.selectedSamplingRecord = record;
    this.isSamplingRecordLookupOpen = false;
  }

  openStandardLookup(): void {
    this.isStandardLookupOpen = true;
  }

  openStandardLookupWithSelection(): void {
    this.isStandardLookupOpen = true;
  }

  onStandardsSelected(selectedIds: number[]): void {
    this.newReport.testReportStandardIds = selectedIds;
    this.isStandardLookupOpen = false;
  }

  openSamplerLookup(): void {
    this.isSamplerLookupOpen = true;
  }

  openSamplerLookupWithSelection(): void {
    this.isSamplerLookupOpen = true;
  }

  onSamplersSelected(selectedSamplers: { id: string, lastName: string }[]): void {
    if (!selectedSamplers || selectedSamplers.length === 0) return;

    const ids = selectedSamplers.map(s => s.id);
    const names = selectedSamplers.map(s => s.lastName);

    this.newReport.testReportSamplerIds = ids;
    this.selectedSamplerNames = names;

    this.notificationService.showInfo("A mintavevők frissítve. Kérjük, mentse el a jelentést a változtatások fennmaradásához.");

    this.isSamplerLookupOpen = false;
  }

  generateReport(id: number): void {
    this.isGeneratingReport = true;

    this.testReportService.generateReport(id).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `report_${id}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.isGeneratingReport = false;
        this.notificationService.showSuccess('A jelentés sikeresen letöltve.');
      },
      error: (err) => {
        console.error('Hiba a jelentés generálásakor:', err);
        this.isGeneratingReport = false;
        this.notificationService.showError('Hiba a jelentés generálásakor.');
      }
    });
  }
}

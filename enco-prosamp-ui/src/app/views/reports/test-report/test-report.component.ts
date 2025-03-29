import {Component, OnInit} from '@angular/core';
import {
  TestReportRequestDTO,
  TestReportResponseDTO,
  TestReportService
} from "../../../services/reports/testreport.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent, FormDirective, FormFeedbackComponent, FormLabelDirective,
  ModalBodyComponent, ModalComponent,
  ModalHeaderComponent, RowComponent,
} from "@coreui/angular";
import {FormsModule, NgForm} from "@angular/forms";
import {
  ProjectLookupModalComponent
} from "../../sampling/sampling-record-dat-m200/modals/project-lookup-modal/project-lookup-modal.component";
import {
  LocationLookupModalComponent
} from "../../sampling/sampling-record-dat-m200/modals/location-lookup-modal/location-lookup-modal.component";
import {
  SamplingRecordLookupModalComponent
} from "../../sampling/samples/modal/sampling-record-lookup-modal/sampling-record-lookup-modal.component";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

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
    DatePipe
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

  // Csak a Sampling Record lookup modal szükséges
  isSamplingRecordLookupOpen = false;

  // A kiválasztott Sampling Record teljes adatait itt tároljuk
  selectedSamplingRecord: any = null;

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
      error: err => console.error('Failed to load test reports', err)
    });
  }

  createEmptyReport(): TestReportRequestDTO {
    return {
      reportNumber: '',
      title: '',
      approvedBy: '',
      preparedBy: '',
      checkedBy: '',
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

  openModal(report?: TestReportResponseDTO): void {
    if (report) {
      this.selectedReportId = report.id;
      this.newReport = { ...report };
      // Amennyiben szerkesztésről van szó, nem módosítjuk a kiválasztott sampling record adatot
      // Feltételezhető, hogy az adatok már megvannak
    } else {
      this.selectedReportId = null;
      this.newReport = this.createEmptyReport();
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
    console.log('Form submitted:', this.newReport);
    const action = this.selectedReportId === null
      ? this.testReportService.create(this.newReport)
      : this.testReportService.update(this.selectedReportId, this.newReport);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedReportId ? 'Jelentés frissítve' : 'Jelentés létrehozva'
        );
        this.closeModal();
        this.loadReports();
      },
      error: (err) => {
        console.error('Hiba mentés közben:', err);
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

  // Megnyitja a Sampling Record lookup modalt
  openSamplingRecordLookup() {
    this.isSamplingRecordLookupOpen = true;
  }

  // A sampling record kiválasztása után:
  // - beállítjuk a newReport.samplingRecordId-t,
  // - kinyerjük belőle a project.id és siteLocation.id értékét,
  // - eltároljuk a teljes kiválasztott objektumot a megjelenítéshez.
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
}

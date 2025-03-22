import {Component, OnInit} from '@angular/core';
import {
  ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent,
  ColComponent,
  FormDirective,
  FormFeedbackComponent,
  FormLabelDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent, ModalHeaderComponent,
  OffcanvasBodyComponent,
  OffcanvasComponent,
  OffcanvasHeaderComponent, RowComponent
} from "@coreui/angular";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ProjectRequestDTO, ProjectResponseDTO, ProjectService} from 'src/app/services/projects/projects.service';
import {ClientResponseDTO } from "../../services/partners/client.service";
import {NotificationService} from "../../services/notification/notification.service";
import {ClientLookupModalComponent} from "./client-lookup-modal/client-lookup-modal.component";

@Component({
  selector: 'app-projects',
  imports: [
    OffcanvasComponent,
    OffcanvasHeaderComponent,
    OffcanvasBodyComponent,
    ButtonDirective,
    ModalFooterComponent,
    FormLabelDirective,
    ColComponent,
    NgIf,
    FormFeedbackComponent,
    FormsModule,
    FormDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    NgForOf,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    RowComponent,
    DatePipe,
    ClientLookupModalComponent,
    NgClass
  ],
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projectList: ProjectResponseDTO[] = [];
  newProject: ProjectRequestDTO = this.createEmptyProject();
  selectedProjectId: number | null = null;
  selectedProjectForDetails: ProjectResponseDTO | null = null;
  clientFilter = '';

  isModalOpen = false;
  isDrawerOpen = false;
  isClientSelectorModalOpen = false;
  formValidated = false;
  filterText = '';

  sortColumn: keyof ProjectResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  createEmptyProject(): ProjectRequestDTO {
    return {
      projectNumber: '',
      clientId: null!,
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'ONGOING'
    };
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: data => this.projectList = data,
      error: err => console.error('Failed to load projects', err)
    });
  }

  openModal(project?: ProjectResponseDTO): void {
    if (project) {
      this.selectedProjectId = project.id;
      this.newProject = {
        projectNumber: project.projectNumber,
        clientId: project.clientId,
        projectName: project.projectName,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status
      };
      this.clientFilter = project.clientName;
    } else {
      this.selectedProjectId = null;
      this.newProject = this.createEmptyProject();
      this.clientFilter = '';
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newProject.projectNumber || !this.newProject.clientId || !this.newProject.projectName) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedProjectId == null
      ? this.projectService.create(this.newProject)
      : this.projectService.update(this.selectedProjectId, this.newProject);

    action.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedProjectId ? 'Projekt módosítva' : 'Projekt létrehozva'
        );
        this.closeModal();
        this.loadProjects();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  openDetails(project: ProjectResponseDTO): void {
    this.selectedProjectForDetails = project;
    this.isDrawerOpen = true;
  }

  closeDetails(): void {
    this.selectedProjectForDetails = null;
    this.isDrawerOpen = false;
  }

  openClientSelector(): void {
    this.isClientSelectorModalOpen = true;
  }

  onClientSelected(client: ClientResponseDTO): void {
    this.newProject.clientId = client.id;
    this.clientFilter = client.name;
    this.isClientSelectorModalOpen = false;
  }

  get filteredProjects(): ProjectResponseDTO[] {
    let filtered = this.projectList;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(p =>
        p.projectName.toLowerCase().includes(lower) ||
        p.projectNumber.toLowerCase().includes(lower) ||
        p.clientName.toLowerCase().includes(lower)     // 👈 új feltétel
    );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aValue = (a[column] ?? '').toString().toLowerCase();
        const bValue = (b[column] ?? '').toString().toLowerCase();
        return aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    return filtered;
  }

  toggleSort(column: keyof ProjectResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}


import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectResponseDTO, ProjectsService} from "../../../../../services/projects/projects.service";
import {
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-project-lookup-modal',
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    FormsModule,
    ButtonDirective,
    NgForOf,
    ModalFooterComponent
  ],
  templateUrl: './project-lookup-modal.component.html',
  styleUrl: './project-lookup-modal.component.scss'
})
export class ProjectLookupModalComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() projectSelected = new EventEmitter<ProjectResponseDTO>();

  projects: ProjectResponseDTO[] = [];
  filter = '';

  constructor(private projectService: ProjectsService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: data => {
        this.projects = data.filter(p => !this.filter || p.projectName.toLowerCase().includes(this.filter.toLowerCase()));
      },
      error: err => console.error('Project fetch failed', err)
    });
  }

  select(project: ProjectResponseDTO): void {
    this.projectSelected.emit(project);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

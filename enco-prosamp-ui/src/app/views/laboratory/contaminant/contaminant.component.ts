import {Component, OnInit} from '@angular/core';
import {
  ContaminantRequestDTO,
  ContaminantResponseDTO,
  ContaminantService
} from "../../../services/laboratory/contaminant.service";
import {
  ContaminantGroupResponseDTO,
  ContaminantGroupService
} from "../../../services/laboratory/contaminant-group.service";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-contaminant',
  imports: [],
  standalone: true,
  templateUrl: './contaminant.component.html',
  styleUrl: './contaminant.component.scss'
})
export class ContaminantComponent implements OnInit {
  contaminants: ContaminantResponseDTO[] = [];
  contaminantGroups: ContaminantGroupResponseDTO[] = [];

  newContaminant: ContaminantRequestDTO = { name: '', description: '', contaminantGroupId: 0 };
  selectedContaminantId: number | null = null;
  formValidated = false;

  constructor(
    private contaminantService: ContaminantService,
    private contaminantGroupService: ContaminantGroupService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadContaminants();
    this.loadContaminantGroups();
  }

  loadContaminants(): void {
    this.contaminantService.getAll().subscribe({
      next: data => this.contaminants = data,
      error: err => console.error('Failed to load contaminants', err)
    });
  }

  loadContaminantGroups(): void {
    this.contaminantGroupService.getAll().subscribe({
      next: data => this.contaminantGroups = data,
      error: err => console.error('Failed to load contaminant groups', err)
    });
  }

  onSubmit(): void {
    if (!this.newContaminant.name || !this.newContaminant.contaminantGroupId) {
      this.formValidated = true;
      return;
    }

    if (this.selectedContaminantId === null) {
      this.contaminantService.create(this.newContaminant).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contaminant created');
          this.resetForm();
          this.loadContaminants();
        },
        error: () => this.notificationService.showError('Creation failed')
      });
    } else {
      this.contaminantService.update(this.selectedContaminantId, this.newContaminant).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contaminant updated');
          this.resetForm();
          this.loadContaminants();
        },
        error: () => this.notificationService.showError('Update failed')
      });
    }
  }

  editContaminant(contaminant: ContaminantResponseDTO): void {
    this.selectedContaminantId = contaminant.id;
    this.newContaminant = {
      name: contaminant.name,
      description: contaminant.description,
      contaminantGroupId: contaminant.contaminantGroup.id
    };
  }

  resetForm(): void {
    this.newContaminant = { name: '', description: '', contaminantGroupId: 0 };
    this.selectedContaminantId = null;
    this.formValidated = false;
  }
}

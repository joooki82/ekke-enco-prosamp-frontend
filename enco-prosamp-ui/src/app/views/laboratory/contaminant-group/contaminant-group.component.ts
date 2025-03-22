import {Component, OnInit} from '@angular/core';
import {
  ContaminantGroupRequestDTO,
  ContaminantGroupResponseDTO, ContaminantGroupService
} from "../../../services/laboratory/contaminant-group.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective, FormDirective, FormFeedbackComponent, FormLabelDirective,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-contaminant-group',
  imports: [
    DatePipe,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    FormControlDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    FormDirective,
    ButtonDirective,
    NgIf,
    NgForOf
  ],
  standalone: true,
  templateUrl: './contaminant-group.component.html',
  styleUrl: './contaminant-group.component.scss'
})
export class ContaminantGroupComponent implements OnInit {
  contaminantGroups: ContaminantGroupResponseDTO[] = [];
  newContaminantGroup: ContaminantGroupRequestDTO = {name: '', description: ''};
  selectedGroupId: number | null = null;
  formValidated = false;

  constructor(
    private contaminantGroupService: ContaminantGroupService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.contaminantGroupService.getAll().subscribe({
      next: data => this.contaminantGroups = data,
      error: err => console.error('Failed to load contaminant groups', err)
    });
  }

  onSubmit(): void {
    if (!this.newContaminantGroup.name) {
      this.formValidated = true;
      return;
    }

    if (this.selectedGroupId === null) {
      this.contaminantGroupService.create(this.newContaminantGroup).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contaminant group created');
          this.resetForm();
          this.loadGroups();
        },
        error: err => this.notificationService.showError('Failed to create group')
      });
    } else {
      this.contaminantGroupService.update(this.selectedGroupId, this.newContaminantGroup).subscribe({
        next: () => {
          this.notificationService.showSuccess('Contaminant group updated');
          this.resetForm();
          this.loadGroups();
        },
        error: err => this.notificationService.showError('Failed to update group')
      });
    }
  }

  editGroup(group: ContaminantGroupResponseDTO): void {
    this.selectedGroupId = group.id;
    this.newContaminantGroup = {name: group.name, description: group.description};
  }

  resetForm(): void {
    this.newContaminantGroup = {name: '', description: ''};
    this.selectedGroupId = null;
    this.formValidated = false;
  }

}

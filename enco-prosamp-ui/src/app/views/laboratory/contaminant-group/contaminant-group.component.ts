import {Component, OnInit} from '@angular/core';
import {
  ContaminantGroupRequestDTO,
  ContaminantGroupResponseDTO,
  ContaminantGroupService
} from "../../../services/laboratory/contaminant-group.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {HasRolesDirective} from "keycloak-angular";

@Component({
  selector: 'app-contaminant-group',
  imports: [
    DatePipe,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    FormsModule,
    ButtonDirective,
    NgIf,
    NgForOf,
    ModalFooterComponent,
    ModalBodyComponent,
    ModalHeaderComponent,
    ModalComponent,
    HasRolesDirective
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

  searchText: string = '';
  isModalOpen: boolean = false;


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
      error: err => console.error('Hiba a szennyezőanyag csoport betöltésekor', err)
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
          this.notificationService.showSuccess('Szennyezőanyag csoport létrehozva');
          this.resetForm();
          this.loadGroups();
        },
        error: () => this.notificationService.showError('Nem sikerült létrehozni a csoportot')
      });
    } else {
      this.contaminantGroupService.update(this.selectedGroupId, this.newContaminantGroup).subscribe({
        next: () => {
          this.notificationService.showSuccess('Szennyezőanyag csoport frissítve');
          this.resetForm();
          this.loadGroups();
        },
        error: () => this.notificationService.showError('Nem sikerült frissíteni a csoportot')
      });
    }
  }

  editGroup(group: ContaminantGroupResponseDTO): void {
    this.selectedGroupId = group.id;
    this.newContaminantGroup = {name: group.name, description: group.description};
    this.isModalOpen = true;
  }

  resetForm(): void {
    this.newContaminantGroup = {name: '', description: ''};
    this.selectedGroupId = null;
    this.formValidated = false;
    this.isModalOpen = false;
  }

  get filteredGroups(): ContaminantGroupResponseDTO[] {
    if (!this.searchText.trim()) return this.contaminantGroups;

    const text = this.searchText.toLowerCase();
    return this.contaminantGroups.filter(group =>
      group.name?.toLowerCase().includes(text) ||
      group.description?.toLowerCase().includes(text)
    );
  }


}

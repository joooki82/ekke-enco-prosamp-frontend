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
  RowComponent
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HasRolesDirective} from "keycloak-angular";

@Component({
  selector: 'app-contaminant',
  imports: [
    ButtonDirective,
    DatePipe,
    NgForOf,
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    FormDirective,
    RowComponent,
    ModalFooterComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    NgIf,
    HasRolesDirective
  ],
  standalone: true,
  templateUrl: './contaminant.component.html',
  styleUrl: './contaminant.component.scss'
})
export class ContaminantComponent implements OnInit {
  contaminants: ContaminantResponseDTO[] = [];
  contaminantGroups: ContaminantGroupResponseDTO[] = [];

  newContaminant: ContaminantRequestDTO = {name: '', description: '', contaminantGroupId: 0};
  selectedContaminantId: number | null = null;
  formValidated = false;

  isModalOpen = false;
  filterGroupId: number | null = null;

  searchText: string = '';


  constructor(
    private contaminantService: ContaminantService,
    private contaminantGroupService: ContaminantGroupService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(): void {
    this.loadContaminants();
    this.loadContaminantGroups();
  }

  loadContaminants(): void {
    this.contaminantService.getAll().subscribe({
      next: data => this.contaminants = data,
      error: err => console.error('Nem sikerült betölteni a szennyezőanyagokat', err)
    });
  }

  loadContaminantGroups(): void {
    this.contaminantGroupService.getAll().subscribe({
      next: data => this.contaminantGroups = data,
      error: err => console.error('Nem sikerült betölteni a szennyező csoportokat', err)
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
          this.notificationService.showSuccess('Szennyezőanyag létrehozása sikeres');
          this.resetForm();
          this.loadContaminants();
        },
        error: () => this.notificationService.showError('Szennyezőanyag létrehozása nem sikerült')
      });
    } else {
      this.contaminantService.update(this.selectedContaminantId, this.newContaminant).subscribe({
        next: () => {
          this.notificationService.showSuccess('Szenyezőanyag frissítve');
          this.resetForm();
          this.loadContaminants();
        },
        error: () => this.notificationService.showError('Frissítés nem sikerült')
      });
    }
  }


  resetForm(): void {
    this.newContaminant = {name: '', description: '', contaminantGroupId: 0};
    this.selectedContaminantId = null;
    this.formValidated = false;
  }

  openModal(contaminant?: ContaminantResponseDTO): void {
    this.resetForm();

    if (contaminant) {
      this.selectedContaminantId = contaminant.id;
      this.newContaminant = {
        name: contaminant.name,
        description: contaminant.description,
        contaminantGroupId: contaminant.contaminantGroup.id
      };
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }


  get filteredContaminants(): ContaminantResponseDTO[] {
    let filtered = this.contaminants;

    if (this.filterGroupId) {
      filtered = filtered.filter(c => c.contaminantGroup?.id === this.filterGroupId);
    }

    if (this.searchText?.trim()) {
      const text = this.searchText.toLowerCase();
      filtered = filtered.filter(c =>
        c.name?.toLowerCase().includes(text) ||
        c.description?.toLowerCase().includes(text)
      );
    }

    return filtered;
  }


}

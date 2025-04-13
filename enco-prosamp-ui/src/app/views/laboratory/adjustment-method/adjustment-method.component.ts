import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {
  AdjustmentMethodService,
  AdjustmentMethodResponseDTO,
  AdjustmentMethodRequestDTO
} from '../../../services/laboratory/adjustment-method.service';
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
import {NotificationService} from "../../../services/notification/notification.service";
import {HasRolesDirective} from "keycloak-angular";

@Component({
  selector: 'app-adjustment-method',
  templateUrl: './adjustment-method.component.html',
  styleUrls: ['./adjustment-method.component.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, FormsModule, ButtonDirective, DatePipe, ModalFooterComponent, ModalComponent, ModalHeaderComponent, ModalBodyComponent, HasRolesDirective]
})
export class AdjustmentMethodComponent implements OnInit {
  adjustmentMethods: AdjustmentMethodResponseDTO[] = [];
  newAdjustmentMethod: AdjustmentMethodRequestDTO = {code: '', description: ''};
  selectedMethodId: number | null = null;
  formValidated = false;

  isModalOpen: boolean = false;

  filterText: string = '';


  constructor(private adjustmentMethodService: AdjustmentMethodService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadAdjustmentMethods();
  }

  loadAdjustmentMethods(): void {
    this.adjustmentMethodService.getAll().subscribe({
      next: (data: AdjustmentMethodResponseDTO[]) => (this.adjustmentMethods = data),
      error: (err: any) => console.error('Nem sikerült betölteni a beállítási módszereket', err)
    });
  }

  onSubmit(): void {
    if (!this.newAdjustmentMethod.code) {
      this.formValidated = true;
      return;
    }

    if (this.selectedMethodId === null) {
      this.adjustmentMethodService.create(this.newAdjustmentMethod).subscribe({
        next: (response: any) => {
          console.log('Created:', response);
          this.notificationService.showSuccess('Beállítási módszer létrehozva');
          this.resetForm();
          this.loadAdjustmentMethods();
        },
        error: (err: any) => {
          console.error('Nem sikerült létrehozni a beállítási módszert', err)
          this.notificationService.showError('Nem sikerült létrehozni a beállítási módszert');
        }
      });
    } else {
      this.adjustmentMethodService.update(this.selectedMethodId, this.newAdjustmentMethod).subscribe({
        next: (response: AdjustmentMethodResponseDTO) => {
          console.log('Frissítve:', response);
          this.resetForm();
          this.loadAdjustmentMethods();
        },
        error: (err: any) => console.error('Nem sikerült frissíteni a beállítási módszert', err)
      });
    }
  }

  editMethod(method: AdjustmentMethodResponseDTO): void {
    this.selectedMethodId = method.id;
    this.newAdjustmentMethod = {code: method.code, description: method.description};
    this.isModalOpen = true;
  }


  resetForm(): void {
    this.newAdjustmentMethod = {code: '', description: ''};
    this.selectedMethodId = null;
    this.formValidated = false;
    this.isModalOpen = false;
  }

  get filteredMethods(): AdjustmentMethodResponseDTO[] {
    if (!this.filterText) {
      return this.adjustmentMethods;
    }

    const text = this.filterText.toLowerCase();
    return this.adjustmentMethods.filter(m =>
      m.code?.toLowerCase().includes(text) ||
      m.description?.toLowerCase().includes(text)
    );
  }


}

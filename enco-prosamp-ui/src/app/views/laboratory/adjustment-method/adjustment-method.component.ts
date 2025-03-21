import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common'; // ✅ Import necessary Angular directives
import {
  AdjustmentMethodService,
  AdjustmentMethodResponseDTO,
  AdjustmentMethodRequestDTO
} from '../../../services/adjustment-method.service';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent, FormControlDirective,
  FormDirective, FormFeedbackComponent, FormLabelDirective,
  RowComponent
} from "@coreui/angular";
import {FormsModule} from "@angular/forms";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
  selector: 'app-adjustment-method',
  templateUrl: './adjustment-method.component.html',
  styleUrls: ['./adjustment-method.component.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, FormsModule, FormDirective, FormFeedbackComponent, FormControlDirective, FormLabelDirective, ButtonDirective, DatePipe] // ✅ Ensure Angular directives are imported
})
export class AdjustmentMethodComponent implements OnInit {
  adjustmentMethods: AdjustmentMethodResponseDTO[] = [];
  newAdjustmentMethod: AdjustmentMethodRequestDTO = {code: '', description: ''};
  selectedMethodId: number | null = null; // ✅ Tracks if we are editing an existing method
  formValidated = false;

  constructor(private adjustmentMethodService: AdjustmentMethodService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loadAdjustmentMethods();
  }

  /** Fetch all adjustment methods */
  loadAdjustmentMethods(): void {
    this.adjustmentMethodService.getAll().subscribe({
      next: (data: AdjustmentMethodResponseDTO[]) => (this.adjustmentMethods = data),
      error: (err: any) => console.error('Failed to load adjustment methods', err)
    });
  }

  /** Create or update an adjustment method */
  onSubmit(): void {
    if (!this.newAdjustmentMethod.code) {
      this.formValidated = true;
      return;
    }

    if (this.selectedMethodId === null) {
      // ✅ Create new method
      this.adjustmentMethodService.create(this.newAdjustmentMethod).subscribe({
        next: (response: any) => {
          console.log('Created:', response);
          this.notificationService.showToast({title: 'Adjustment method created', color: 'success'});
          this.resetForm();
          this.loadAdjustmentMethods();
        },
        error: (err: any) => console.error('Failed to create adjustment method', err)
      });
    } else {
      // ✅ Update existing method
      this.adjustmentMethodService.update(this.selectedMethodId, this.newAdjustmentMethod).subscribe({
        next: (response: AdjustmentMethodResponseDTO) => {
          console.log('Updated:', response);
          this.resetForm();
          this.loadAdjustmentMethods();
        },
        error: (err: any) => console.error('Failed to update adjustment method', err)
      });
    }
  }

  /** Load an existing method into the form for editing */
  editMethod(method: AdjustmentMethodResponseDTO): void {
    this.selectedMethodId = method.id;
    this.newAdjustmentMethod = {code: method.code, description: method.description};
  }

  /** Reset form and switch back to create mode */
  resetForm(): void {
    this.newAdjustmentMethod = {code: '', description: ''};
    this.selectedMethodId = null;
    this.formValidated = false;
  }
}

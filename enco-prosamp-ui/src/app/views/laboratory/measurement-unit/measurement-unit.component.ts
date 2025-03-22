import { Component, OnInit } from '@angular/core';
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
} from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, DatePipe} from '@angular/common';
import { NotificationService } from '../../../services/notification/notification.service';
import {
  MeasurementUnitRequestDTO,
  MeasurementUnitResponseDTO, MeasurementUnitService
} from "../../../services/laboratory/measurement-unit.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-measurement-unit',
  standalone: true,
  templateUrl: './measurement-unit.component.html',
  styleUrl: './measurement-unit.component.scss',
  imports: [
    ColComponent,
    RowComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormsModule,
    NgForOf,
    NgIf,
    DatePipe
  ]
})
export class MeasurementUnitComponent implements OnInit {
  units: MeasurementUnitResponseDTO[] = [];
  allUnits: MeasurementUnitResponseDTO[] = [];
  newUnit: MeasurementUnitRequestDTO = this.createEmptyUnit();
  selectedUnitId: number | null = null;
  isModalOpen = false;
  formValidated = false;
  filterText = '';

  constructor(
    private unitService: MeasurementUnitService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  createEmptyUnit(): MeasurementUnitRequestDTO {
    return {
      id: null,
      unitCode: '',
      description: '',
      unitCategory: '',
      baseUnitId: null,
      conversionFactor: null,
      standardBody: ''
    };
  }

  loadUnits(): void {
    this.unitService.getAll().subscribe({
      next: data => {
        this.units = data;
        this.allUnits = data;
      },
      error: err => console.error('Failed to load units', err)
    });
  }

  openModal(unit?: MeasurementUnitResponseDTO): void {
    if (unit) {
      this.selectedUnitId = unit.id!;
      this.newUnit = {
        id: unit.id,
        unitCode: unit.unitCode,
        description: unit.description,
        unitCategory: unit.unitCategory,
        baseUnitId: unit.baseUnit?.id ?? null,
        conversionFactor: unit.conversionFactor,
        standardBody: unit.standardBody
      };
    } else {
      this.selectedUnitId = null;
      this.newUnit = this.createEmptyUnit();
    }
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formValidated = false;
  }

  onSubmit(): void {
    if (!this.newUnit.unitCode || !this.newUnit.description || !this.newUnit.unitCategory) {
      this.formValidated = true;
      return;
    }

    const action = this.selectedUnitId === null
      ? this.unitService.create(this.newUnit)
      : this.unitService.update(this.selectedUnitId, this.newUnit);

    (action as Observable<any>).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.selectedUnitId ? 'Mértékegység módosítva' : 'Mértékegység létrehozva'
        );
        this.closeModal();
        this.loadUnits();
      },
      error: () => this.notificationService.showError('Művelet sikertelen')
    });
  }

  get filteredUnits(): MeasurementUnitResponseDTO[] {
    const lower = this.filterText.toLowerCase();
    return this.units.filter(unit =>
      unit.unitCode.toLowerCase().includes(lower) ||
      unit.description.toLowerCase().includes(lower)
    );
  }
}

import {Component, OnInit} from '@angular/core';
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
import {FormsModule} from '@angular/forms';
import {NgIf, NgForOf, DatePipe, NgClass} from '@angular/common';
import {NotificationService} from '../../../services/notification/notification.service';
import {
  MeasurementUnitRequestDTO,
  MeasurementUnitResponseDTO, MeasurementUnitService
} from "../../../services/laboratory/measurement-unit.service";
import {Observable} from "rxjs";
import {HasRolesDirective} from "keycloak-angular";

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
    DatePipe,
    NgClass,
    HasRolesDirective
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
  sortColumn: keyof MeasurementUnitResponseDTO | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';


  constructor(
    private unitService: MeasurementUnitService,
    private notificationService: NotificationService
  ) {
  }

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
      error: err => console.error('Hiba a mértékegységek betöltésekor', err)
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
    let filtered = this.units;

    if (this.filterText) {
      const lower = this.filterText.toLowerCase();
      filtered = filtered.filter(unit =>
        unit.unitCode.toLowerCase().includes(lower) ||
        unit.description.toLowerCase().includes(lower)
      );
    }

    if (this.sortColumn !== null) {
      filtered = [...filtered].sort((a, b) => {
        const column = this.sortColumn!;
        const aValue = (a[column] ?? '').toString().toLowerCase();
        const bValue = (b[column] ?? '').toString().toLowerCase();

        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  toggleSort(column: keyof MeasurementUnitResponseDTO): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

}

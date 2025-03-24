import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CompanyResponseDTO, CompanyService} from "../../../../../services/partners/company.service";
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
  selector: 'app-company-lookup-modal',
  standalone: true,
  templateUrl: './company-lookup-modal.component.html',
  styleUrl: './company-lookup-modal.component.scss',
  imports: [
    ModalBodyComponent,
    ModalComponent,
    ModalHeaderComponent,
    FormsModule,
    NgForOf,
    ButtonDirective,
    ModalFooterComponent,
    /* CoreUI, FormsModule, NgFor, NgIf, etc. */]
})
export class CompanyLookupModalComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() companySelected = new EventEmitter<CompanyResponseDTO>();

  companies: CompanyResponseDTO[] = [];
  filter = '';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAll().subscribe({
      next: data => {
        this.companies = data.filter(c =>
          this.filter ? c.name.toLowerCase().includes(this.filter.toLowerCase()) : true
        );
      },
      error: err => console.error('Company fetch error', err)
    });
  }

  select(company: CompanyResponseDTO): void {
    this.companySelected.emit(company);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

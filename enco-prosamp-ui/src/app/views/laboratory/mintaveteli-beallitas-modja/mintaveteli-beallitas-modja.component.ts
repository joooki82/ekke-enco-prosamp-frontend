import {Component, OnInit} from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  RowComponent, TableDirective
} from "@coreui/angular";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";

interface AdjustmentMethodResponseDTO {
  id: number;
  code: string;
  description: string;
}


@Component({
  selector: 'app-mintaveteli-beallitas-modja',
  imports: [
    CardHeaderComponent,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    ContainerComponent,
    TableDirective,
    NgIf
  ],
  templateUrl: './mintaveteli-beallitas-modja.component.html',
  styleUrl: './mintaveteli-beallitas-modja.component.scss'
})
export class MintaveteliBeallitasModjaComponent implements OnInit {
  adjustmentMethod: AdjustmentMethodResponseDTO | null = null;
  errorMessage: string | null = null;
  isLoading = true;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.fetchAdjustmentMethod(parseInt(id, 10));
    } else {
      this.errorMessage = 'Invalid ID';
      this.isLoading = false;
    }
  }

  fetchAdjustmentMethod(id: number) {
    this.http.get<AdjustmentMethodResponseDTO>(`http://localhost:8081/api/adjustment-methods/${id}`).subscribe({
      next: (data) => {
        this.adjustmentMethod = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching data';
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}

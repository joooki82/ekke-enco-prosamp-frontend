import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface AdjustmentMethodResponseDTO {
  id: number;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdjustmentMethodRequestDTO {
  code: string;
  description: string;
}

export interface AdjustmentMethodCreatedDTO {
  id: number;
  code: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdjustmentMethodService {
  private baseUrl = `${environment.apiUrl}/api/adjustment-methods`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdjustmentMethodResponseDTO[]> {
    return this.http.get<AdjustmentMethodResponseDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<AdjustmentMethodResponseDTO> {
    return this.http.get<AdjustmentMethodResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(data: AdjustmentMethodRequestDTO): Observable<AdjustmentMethodCreatedDTO> {
    return this.http.post<AdjustmentMethodCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: AdjustmentMethodRequestDTO): Observable<AdjustmentMethodResponseDTO> {
    return this.http.put<AdjustmentMethodResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

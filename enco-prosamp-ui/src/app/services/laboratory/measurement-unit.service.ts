import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface MeasurementUnitRequestDTO {
  id?: number | null;
  unitCode: string;
  description: string;
  unitCategory: string;
  baseUnitId?: number | null;
  conversionFactor?: number | null;
  standardBody?: string | null;
}

export interface MeasurementUnitResponseDTO {
  id: number;
  unitCode: string;
  description: string;
  unitCategory: string;
  conversionFactor: number | null;
  standardBody: string | null;
  baseUnit?: {
    id: number;
    unitCode: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementUnitCreatedDTO extends MeasurementUnitRequestDTO {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class MeasurementUnitService {
  private baseUrl = `${environment.apiUrl}/api/measurement-units`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<MeasurementUnitResponseDTO[]> {
    return this.http.get<MeasurementUnitResponseDTO[]>(this.baseUrl);
  }

  create(data: MeasurementUnitRequestDTO): Observable<MeasurementUnitCreatedDTO> {
    return this.http.post<MeasurementUnitCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: MeasurementUnitRequestDTO): Observable<MeasurementUnitResponseDTO> {
    return this.http.put<MeasurementUnitResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

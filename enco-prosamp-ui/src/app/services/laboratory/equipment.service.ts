import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

export interface EquipmentRequestDTO {
  name: string;
  identifier: string;
  description?: string;
  manufacturer?: string;
  type?: string;
  serialNumber?: string;
  measuringRange?: string;
  resolution?: string;
  accuracy?: string;
  calibrationDate?: string;
  nextCalibrationDate?: string;
}

export interface EquipmentCreatedDTO extends EquipmentRequestDTO {
  id: number;
}

export interface EquipmentResponseDTO extends EquipmentRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  private baseUrl = `${environment.apiUrl}/api/equipments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<EquipmentResponseDTO[]> {
    return this.http.get<EquipmentResponseDTO[]>(this.baseUrl);
  }

  create(data: EquipmentRequestDTO): Observable<EquipmentCreatedDTO> {
    return this.http.post<EquipmentCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: EquipmentRequestDTO): Observable<EquipmentResponseDTO> {
    return this.http.put<EquipmentResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

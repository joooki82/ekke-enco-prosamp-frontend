import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface LaboratoryRequestDTO {
  name: string;
  accreditation?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface LaboratoryCreatedDTO extends LaboratoryRequestDTO {
  id: number;
}

export interface LaboratoryResponseDTO extends LaboratoryCreatedDTO {
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class LaboratoryService {
  private baseUrl = `${environment.apiUrl}/api/laboratories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LaboratoryResponseDTO[]> {
    return this.http.get<LaboratoryResponseDTO[]>(this.baseUrl);
  }

  create(data: LaboratoryRequestDTO): Observable<LaboratoryCreatedDTO> {
    return this.http.post<LaboratoryCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: LaboratoryRequestDTO): Observable<LaboratoryResponseDTO> {
    return this.http.put<LaboratoryResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

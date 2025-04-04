import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface SamplingTypeRequestDTO {
  code: string;
  description: string;
}

export interface SamplingTypeResponseDTO {
  id: number;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SamplingTypeCreatedDTO extends SamplingTypeRequestDTO {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class SamplingTypeService {
  private baseUrl = `${environment.apiUrl}/api/accredited_laboratory/sampling-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SamplingTypeResponseDTO[]> {
    return this.http.get<SamplingTypeResponseDTO[]>(this.baseUrl);
  }

  create(data: SamplingTypeRequestDTO): Observable<SamplingTypeCreatedDTO> {
    return this.http.post<SamplingTypeCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: SamplingTypeRequestDTO): Observable<SamplingTypeResponseDTO> {
    return this.http.put<SamplingTypeResponseDTO>(`${this.baseUrl}/${id}`, data);
  }
}

import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface CompanyRequestDTO {
  name: string;
  address?: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
}

export interface CompanyCreatedDTO extends CompanyRequestDTO {
  id: number;
}

export interface CompanyResponseDTO extends CompanyRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = `${environment.apiUrl}/api/companies`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CompanyResponseDTO[]> {
    return this.http.get<CompanyResponseDTO[]>(this.baseUrl);
  }

  create(data: CompanyRequestDTO): Observable<CompanyCreatedDTO> {
    return this.http.post<CompanyCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: CompanyRequestDTO): Observable<CompanyResponseDTO> {
    return this.http.put<CompanyResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

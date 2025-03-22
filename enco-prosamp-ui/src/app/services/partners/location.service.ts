import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface LocationRequestDTO {
  companyId: number;
  name: string;
  address?: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

export interface LocationResponseDTO extends LocationRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  company: {
    id: number;
    name: string;
  };
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private baseUrl = `${environment.apiUrl}/api/locations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LocationResponseDTO[]> {
    return this.http.get<LocationResponseDTO[]>(this.baseUrl);
  }

  create(data: LocationRequestDTO): Observable<LocationResponseDTO> {
    return this.http.post<LocationResponseDTO>(this.baseUrl, data);
  }

  update(id: number, data: LocationRequestDTO): Observable<LocationResponseDTO> {
    return this.http.put<LocationResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

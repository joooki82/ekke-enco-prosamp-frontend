import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface ClientRequestDTO {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  postalCode: string;
  taxNumber: string;
}

export interface ClientCreatedDTO extends ClientRequestDTO {
  id: number;
}

export interface ClientResponseDTO extends ClientRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  private baseUrl = `${environment.apiUrl}/api/clients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClientResponseDTO[]> {
    return this.http.get<ClientResponseDTO[]>(this.baseUrl);
  }

  create(data: ClientRequestDTO): Observable<ClientCreatedDTO> {
    return this.http.post<ClientCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: ClientRequestDTO): Observable<ClientResponseDTO> {
    return this.http.put<ClientResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


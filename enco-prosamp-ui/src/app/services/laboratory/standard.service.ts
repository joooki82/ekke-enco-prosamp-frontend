import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

export interface StandardRequestDTO {
  standardNumber: string;
  description?: string;
  standardType?: string;
  identifier: string;
}

export interface StandardResponseDTO {
  id: number;
  standardNumber: string;
  description?: string;
  standardType?: string;
  standardTypeMagyar?: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
}

export interface StandardCreatedDTO extends StandardRequestDTO {
  id: number;
}

@Injectable({ providedIn: 'root' })
export class StandardService {
  private baseUrl = `${environment.apiUrl}/api/standards`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StandardResponseDTO[]> {
    return this.http.get<StandardResponseDTO[]>(this.baseUrl);
  }

  create(data: StandardRequestDTO): Observable<StandardCreatedDTO> {
    return this.http.post<StandardCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: StandardRequestDTO): Observable<StandardResponseDTO> {
    return this.http.put<StandardResponseDTO>(`${this.baseUrl}/${id}`, data);
  }
}

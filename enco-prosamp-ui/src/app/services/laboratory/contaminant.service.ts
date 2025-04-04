import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface ContaminantResponseDTO {
  id: number;
  name: string;
  description: string;
  contaminantGroup: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContaminantRequestDTO {
  name: string;
  description: string;
  contaminantGroupId: number;
}

export interface ContaminantCreatedDTO {
  id: number;
  name: string;
  description: string;
}

export interface ContaminantListItemDTO {
  id: number;
  name: string;
  description: string;
}


@Injectable({
  providedIn: 'root'
})
export class ContaminantService {
  private baseUrl = `${environment.apiUrl}/api/accredited_laboratory/contaminants`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContaminantResponseDTO[]> {
    return this.http.get<ContaminantResponseDTO[]>(this.baseUrl);
  }

  create(data: ContaminantRequestDTO): Observable<ContaminantCreatedDTO> {
    return this.http.post<ContaminantCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: ContaminantRequestDTO): Observable<ContaminantResponseDTO> {
    return this.http.put<ContaminantResponseDTO>(`${this.baseUrl}/${id}`, data);
  }
}


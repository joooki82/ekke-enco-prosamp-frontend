import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface ContaminantGroupResponseDTO {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContaminantGroupRequestDTO {
  name: string;
  description: string;
}

export interface ContaminantGroupCreatedDTO {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContaminantGroupService {
  private baseUrl = `${environment.apiUrl}/api/contaminant-groups`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ContaminantGroupResponseDTO[]> {
    return this.http.get<ContaminantGroupResponseDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<ContaminantGroupResponseDTO> {
    return this.http.get<ContaminantGroupResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(data: ContaminantGroupRequestDTO): Observable<ContaminantGroupCreatedDTO> {
    return this.http.post<ContaminantGroupCreatedDTO>(this.baseUrl, data);
  }

  update(id: number, data: ContaminantGroupRequestDTO): Observable<ContaminantGroupResponseDTO> {
    return this.http.put<ContaminantGroupResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}

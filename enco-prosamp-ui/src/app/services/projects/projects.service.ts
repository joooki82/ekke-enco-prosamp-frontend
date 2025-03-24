import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

export interface ProjectRequestDTO {
  projectNumber: string;
  clientId: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ProjectCreatedDTO extends ProjectRequestDTO {
  id: number;
}

export interface ProjectResponseDTO {
  id: number;
  projectNumber: string;
  clientId: number;
  clientName: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private baseUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectResponseDTO[]> {
    return this.http.get<ProjectResponseDTO[]>(this.baseUrl);
  }

  get(id: number): Observable<ProjectResponseDTO> {
    return this.http.get<ProjectResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(project: ProjectRequestDTO): Observable<ProjectCreatedDTO> {
    return this.http.post<ProjectCreatedDTO>(this.baseUrl, project);
  }

  update(id: number, project: ProjectRequestDTO): Observable<ProjectResponseDTO> {
    return this.http.put<ProjectResponseDTO>(`${this.baseUrl}/${id}`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

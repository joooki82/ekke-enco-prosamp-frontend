import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface LaboratoryListItemDTO {
  id: number;
  name: string;
  accreditation: string;
}

export interface AnalyticalLabReportRequestDTO {
  reportNumber: string;
  issueDate: string; // ISO format
  laboratoryId: number;
}


export interface AnalyticalLabReportResponseDTO {
  id: number;
  reportNumber: string;
  issueDate: string;
  createdAt: string;
  updatedAt: string;
  laboratory: LaboratoryListItemDTO;
}

@Injectable({ providedIn: 'root' })
export class AnalyticalLabReportService {
  private baseUrl = `${environment.apiUrl}/api/analytical-lab-reports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AnalyticalLabReportResponseDTO[]> {
    return this.http.get<AnalyticalLabReportResponseDTO[]>(this.baseUrl);
  }

  create(data: AnalyticalLabReportRequestDTO): Observable<AnalyticalLabReportResponseDTO> {
    return this.http.post<AnalyticalLabReportResponseDTO>(this.baseUrl, data);
  }

  update(id: number, data: AnalyticalLabReportRequestDTO): Observable<AnalyticalLabReportResponseDTO> {
    return this.http.put<AnalyticalLabReportResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

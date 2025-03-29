import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


export interface TestReportRequestDTO {
  reportNumber: string;
  title: string;
  approvedBy?: string;
  preparedBy?: string;
  checkedBy?: string;
  aimOfTest?: string;
  projectId: number;
  testReportStandardIds?: number[];
  testReportSamplerIds?: string[];
  locationId: number;
  samplingRecordId: number;
  technology?: string;
  samplingConditionsDates?: string;
  determinationOfPollutantConcentration?: string;
  issueDate: string;
  reportStatus: string;
}

// Response DTO
export interface TestReportResponseDTO extends TestReportRequestDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  approvedByUser?: any;
  preparedByUser?: any;
  checkedByUser?: any;
  project?: any;
  location?: any;
  samplingRecord?: any;
  testReportStandards?: any[];
  testReportSamplers?: any[];
}

@Injectable({ providedIn: 'root' })
export class TestReportService {
  private baseUrl = `${environment.apiUrl}/api/testreports`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TestReportResponseDTO[]> {
    return this.http.get<TestReportResponseDTO[]>(this.baseUrl);
  }

  create(data: TestReportRequestDTO): Observable<TestReportResponseDTO> {
    return this.http.post<TestReportResponseDTO>(this.baseUrl, data);
  }

  update(id: number, data: TestReportRequestDTO): Observable<TestReportResponseDTO> {
    return this.http.put<TestReportResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

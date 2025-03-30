import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProjectResponseDTO} from "../projects/projects.service";
import {LocationResponseDTO} from "../partners/location.service";
import {SamplingRecordResponseDTO} from "../sampling/sampling-record-dat-m200.service";
import {StandardResponseDTO} from "../laboratory/standard.service";
import {UserDTO} from "../user/user.service";


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
export interface TestReportResponseDTO {
  id: number;
  reportNumber: string;
  title: string;
  aimOfTest: string;
  createdAt: string;
  updatedAt: string;
  approvedBy: UserDTO;
  preparedBy: UserDTO;
  checkedBy: UserDTO;
  project: ProjectResponseDTO;
  location: LocationResponseDTO;
  samplingRecord?: SamplingRecordResponseDTO;
  testReportStandards: StandardResponseDTO[];
  testReportSamplers: UserDTO[];
  technology: string;
  samplingConditionsDates?: string;
  determinationOfPollutantConcentration?: string;
  issueDate: string;
  reportStatus: string;
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

  generateReport(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/generate`, { responseType: 'blob' });
  }

}

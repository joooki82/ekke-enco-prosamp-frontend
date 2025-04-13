import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
// === DTOs ===

export interface SampleAnalyticalResultRequestDTO {
  sampleContaminantId: number;
  resultMain: number;
  resultControl?: number;
  resultMainControl?: number;
  resultMeasurementUnitId: number;
  isBelowDetectionLimit: boolean;
  detectionLimit?: number;
  measurementUncertainty?: number;
  analysisMethod?: string;
  labReportId: number;
  analysisDate?: string;
}

export interface SampleAnalyticalResultResponseDTO {
  id: number;
  sampleContaminant: {
    id: number;
    sampleIdentifier: string;
    contaminantName: string;
  };
  resultMain: number;
  resultControl?: number;
  resultMainControl?: number;
  resultMeasurementUnit: {
    id: number;
    unitCode: string;
  };
  isBelowDetectionLimit: boolean;
  detectionLimit?: number;
  measurementUncertainty?: number;
  analysisMethod?: string;
  labReport: {
    id: number;
    reportCode: string;
  };
  analysisDate?: string;
  calculatedConcentration?: number;
  calculatedConcentrationMeasurementUnit?: {
    id: number;
    unitCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SampleAnalyticalResultCreatedDTO extends SampleAnalyticalResultResponseDTO {}

@Injectable({
  providedIn: 'root'
})
export class SampleAnalyticalResultService {
  private baseUrl = `${environment.apiUrl}/api/sample-analytical-results`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SampleAnalyticalResultResponseDTO[]> {
    return this.http.get<SampleAnalyticalResultResponseDTO[]>(this.baseUrl);
  }

  get(id: number): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.get<SampleAnalyticalResultResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(dto: SampleAnalyticalResultRequestDTO): Observable<SampleAnalyticalResultCreatedDTO> {
    return this.http.post<SampleAnalyticalResultCreatedDTO>(this.baseUrl, dto);
  }

  update(id: number, dto: SampleAnalyticalResultRequestDTO): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.put<SampleAnalyticalResultResponseDTO>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBySampleContaminantId(sampleContaminantId: number): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.get<SampleAnalyticalResultResponseDTO>(
      `${this.baseUrl}/by-sample-contaminant/${sampleContaminantId}`
    );
  }

}

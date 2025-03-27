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
  analysisDate?: string; // ISO format
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

  // 🔹 Fetch all results
  getAll(): Observable<SampleAnalyticalResultResponseDTO[]> {
    return this.http.get<SampleAnalyticalResultResponseDTO[]>(this.baseUrl);
  }

  // 🔹 Get single result by ID
  get(id: number): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.get<SampleAnalyticalResultResponseDTO>(`${this.baseUrl}/${id}`);
  }

  // 🔹 Create new analytical result
  create(dto: SampleAnalyticalResultRequestDTO): Observable<SampleAnalyticalResultCreatedDTO> {
    return this.http.post<SampleAnalyticalResultCreatedDTO>(this.baseUrl, dto);
  }

  // 🔹 Update an existing result
  update(id: number, dto: SampleAnalyticalResultRequestDTO): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.put<SampleAnalyticalResultResponseDTO>(`${this.baseUrl}/${id}`, dto);
  }

  // 🔹 Delete a result
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getBySampleContaminantId(sampleContaminantId: number): Observable<SampleAnalyticalResultResponseDTO> {
    return this.http.get<SampleAnalyticalResultResponseDTO>(
      `${this.baseUrl}/by-sample-contaminant/${sampleContaminantId}`
    );
  }

}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

export interface SampleRequestDTO {
  samplingRecordId: number;
  sampleIdentifier: string;
  location?: string;
  employeeName?: string;
  temperature?: number | null;
  humidity?: number | null;
  pressure?: number | null;
  sampleVolumeFlowRate?: number | null;
  sampleVolumeFlowRateUnitId: number;
  startTime?: string;
  endTime?: string;
  sampleType: string;
  status: string;
  remarks?: string;
  samplingTypeId?: number;
  adjustmentMethodId?: number;
}

export interface SampleResponseDTO {
  id: number;
  sampleIdentifier: string;
  location: string;
  employeeName: string;
  temperature: number | null;
  humidity: number | null;
  pressure: number | null;
  sampleVolumeFlowRate: number | null;
  sampleVolumeFlowRateUnit: MeasurementUnitListItemDTO;
  startTime: string;
  endTime: string;
  sampleType: string;
  status: string;
  remarks: string;
  samplingRecord: SamplingRecordDatM200ListItemDTO;
  adjustmentMethod?: AdjustmentMethodListItemDTO;
  samplingType?: SamplingTypeListItemDTO;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementUnitListItemDTO {
  id: number;
  unitCode: string;
}

export interface AdjustmentMethodListItemDTO {
  id: number;
  code: string;
}

export interface SamplingTypeListItemDTO {
  id: number;
  code: string;
}

export interface SamplingRecordDatM200ListItemDTO {
  id: number;
  samplingDate: string;
}


@Injectable({ providedIn: 'root' })
export class SamplesService {
  private baseUrl =  `${environment.apiUrl}/api/samples`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SampleResponseDTO[]> {
    return this.http.get<SampleResponseDTO[]>(this.baseUrl);
  }

  create(sample: SampleRequestDTO): Observable<SampleResponseDTO> {
    return this.http.post<SampleResponseDTO>(this.baseUrl, sample);
  }

  update(id: number, sample: SampleRequestDTO): Observable<SampleResponseDTO> {
    return this.http.put<SampleResponseDTO>(`${this.baseUrl}/${id}`, sample);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


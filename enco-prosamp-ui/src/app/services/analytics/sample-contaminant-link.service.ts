import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SampleListItemDTO} from "../sampling/sampling-record-dat-m200.service";


export interface SampleContaminantRequestDTO {
  sampleId: number;
  contaminantId: number;
}


export interface SampleContaminantCreatedDTO {
  id: number;
  sampleId: number;
  sampleIdentifier: string;
  samplingRecordId: number;
  sampleLocation: string;

  contaminantId: number;
  contaminantName: string;
  contaminantDescription: string;
}

export interface SampleWithContaminantsDTO {
  sample: SampleListItemDTO;
  contaminants: ContaminantListItemDTO[];
}

export interface ContaminantListItemDTO {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SampleContaminantLinkService {
  private baseUrl = `${environment.apiUrl}/api/sample-contaminants`;

  constructor(private http: HttpClient) {}

  linkContaminant(request: SampleContaminantRequestDTO): Observable<SampleContaminantCreatedDTO> {
    return this.http.post<SampleContaminantCreatedDTO>(`${this.baseUrl}/link`, request);
  }

  unlinkContaminant(request: SampleContaminantRequestDTO): Observable<void> {
    return this.http.request<void>('delete', `${this.baseUrl}/unlink`, { body: request });
  }

  getContaminantsBySample(sampleId: number): Observable<SampleWithContaminantsDTO> {
    return this.http.get<SampleWithContaminantsDTO>(`${this.baseUrl}/${sampleId}/contaminants`);
  }
}

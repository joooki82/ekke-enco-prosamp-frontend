import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";


/**
 * Request DTO for linking contaminant to sample
 */
export interface SampleContaminantRequestDTO {
  sampleId: number;
  contaminantId: number;
}

/**
 * Response DTO after linking
 */
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

/**
 * Used when fetching sample with contaminant list (includes SampleContaminant ID)
 */
export interface SampleContaminantListItem2DTO {
  id: number;
  contaminant: ContaminantListNameDTO;
}

export interface ContaminantListNameDTO {
  id: number;
  name: string;
}

/**
 * DTO returned by /{sampleId}/samplecontaminants
 */
export interface SampleWithSampleContaminantsDTO {
  sample: {
    id: number;
    sampleIdentifier: string;
  };
  sampleContaminants: SampleContaminantListItem2DTO[];
}

/**
 * DTO returned by /{sampleId}/samplecontaminants
 */
export interface SampleWithContaminantsDTO {
  sample: {
    id: number;
    sampleIdentifier: string;
  };
  sampleContaminants: SampleContaminantListItem2DTO[];
}

export interface SampleIdentifierDTO {
  id: number;
  sampleIdentifier: string;
}

export interface ContaminantListNameDTO {
  id: number;
  name: string;
}

export interface SampleWithContaminantsDTO {
  sample: SampleIdentifierDTO;
  contaminants: ContaminantListNameDTO[];
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

  /**
   * Gets all sample contaminants (with SampleContaminant ID) by sample ID
   */
  getContaminantsBySample(sampleId: number): Observable<SampleWithContaminantsDTO> {
    return this.http.get<SampleWithContaminantsDTO>(`${this.baseUrl}/${sampleId}/contaminants`);
  }

  /**
   * Gets all sample contaminants (with SampleContaminant ID) by sample ID
   */
  getSampleContaminantsBySample(sampleId: number): Observable<SampleWithSampleContaminantsDTO> {
    return this.http.get<SampleWithSampleContaminantsDTO>(`${this.baseUrl}/${sampleId}/samplecontaminants`);
  }
}

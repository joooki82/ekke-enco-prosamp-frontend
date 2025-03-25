import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface UserDTO {
  id: string;
  username: string;
}

export interface CompanyDTO {
  id: number;
  name: string;
  address: string;
}

export interface LocationDTO {
  id: number;
  name: string;
  city: string;
}

export interface ProjectDTO {
  id: number;
  projectNumber: string;
  projectName: string;
  description: string;
  status: string;
}

export interface EquipmentDTO {
  id: number;
  name: string;
  identifier: string;
}

export interface SampleListItemDTO {
  id: number;
  sampleIdentifier: string;
  samplingRecordId: number;
  location: string;
  employeeName: string;
  startTime: string;
  endTime: string;

}

export interface SamplingRecordResponseDTO {
  id: number;
  samplingDate: string;
  conductedBy: UserDTO;
  company: CompanyDTO;
  siteLocation: LocationDTO;
  testedPlant?: string;
  technology?: string;
  shiftCountAndDuration?: number;
  workersPerShift?: number;
  exposureTime: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pressure1?: number;
  pressure2?: number;
  otherEnvironmentalConditions?: string;
  airFlowConditions?: string;
  operationMode?: string;
  operationBreak?: string;
  localAirExtraction?: string;
  serialNumbersOfSamples?: string;
  project: ProjectDTO;
  status: string;
  remarks?: string;
  samplingRecordEquipments: EquipmentDTO[];
  samples: SampleListItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface SamplingRecordRequestDTO {
  samplingDate: string;
  conductedById: string;
  companyId: number;
  siteLocationId: number;
  testedPlant?: string;
  technology?: string;
  shiftCountAndDuration?: number;
  workersPerShift?: number;
  exposureTime: number;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pressure1?: number;
  pressure2?: number;
  otherEnvironmentalConditions?: string;
  airFlowConditions?: string;
  operationMode?: string;
  operationBreak?: string;
  localAirExtraction?: string;
  serialNumbersOfSamples?: string;
  projectId: number;
  status: string;
  remarks?: string;
  equipmentIds?: number[];
}


@Injectable({providedIn: 'root'})
export class SamplingRecordDatM200Service {
  private baseUrl = `${environment.apiUrl}/api/sampling-record-datm200`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<SamplingRecordResponseDTO[]> {
    return this.http.get<SamplingRecordResponseDTO[]>(this.baseUrl);
  }

  get(id: number): Observable<SamplingRecordResponseDTO> {
    return this.http.get<SamplingRecordResponseDTO>(`${this.baseUrl}/${id}`);
  }

  create(record: SamplingRecordRequestDTO): Observable<any> {
    return this.http.post(this.baseUrl, record);
  }

  update(id: number, record: SamplingRecordRequestDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

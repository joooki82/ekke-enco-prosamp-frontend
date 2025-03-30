import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ClientCreatedDTO, ClientRequestDTO, ClientResponseDTO} from "../partners/client.service";
import {AdjustmentMethodResponseDTO} from "../laboratory/adjustment-method.service";

export interface UserDTO {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

}

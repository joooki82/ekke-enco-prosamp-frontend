import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";



export interface UserDTO {
  id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  syncUser = "syncUser";

  private baseUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl);
  }

  getById(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${id}`);
  }

  sync(syncUser: String): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/sync`, syncUser);
  }

}

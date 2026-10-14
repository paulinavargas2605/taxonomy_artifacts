import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserType } from '../models/user-type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  private api = `${environment.apiUrl}/user-types`;

  constructor(private http: HttpClient) { }

  list(): Observable<UserType[]> {

    return this.http.get<UserType[]>(this.api);

  }

}
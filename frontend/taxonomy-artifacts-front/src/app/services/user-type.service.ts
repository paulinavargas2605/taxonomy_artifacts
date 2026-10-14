import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserType } from '../models/user-type';

@Injectable({
  providedIn: 'root'
})
export class UserTypeService {

  private api = "http://127.0.0.1:8000/user-types";

  constructor(private http: HttpClient) { }

  list(): Observable<UserType[]> {

    return this.http.get<UserType[]>(this.api);

  }

}
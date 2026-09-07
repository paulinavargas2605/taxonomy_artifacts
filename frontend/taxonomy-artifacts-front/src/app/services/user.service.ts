import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private api = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  get(id:number): Observable<User>{

    return this.http.get<User>(`${this.api}/${id}`);

  }

  create(user:User){

    return this.http.post(this.api,user);

  }

  update(id:number,user:User){

    return this.http.put(`${this.api}/${id}`,user);

  }

  delete(id:number){

    return this.http.delete(`${this.api}/${id}`);

  }

}

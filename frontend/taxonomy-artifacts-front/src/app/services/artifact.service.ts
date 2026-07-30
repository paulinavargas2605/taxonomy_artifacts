import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Artifact } from '../models/artifact';

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  private api = "http://127.0.0.1:8000/artifacts";

  constructor(private http: HttpClient) { }

  list(): Observable<Artifact[]> {

    return this.http.get<Artifact[]>(this.api);

  }

  get(id:number): Observable<Artifact>{

    return this.http.get<Artifact>(`${this.api}/${id}`);

  }

  create(artifact:Artifact){

    return this.http.post(this.api,artifact);

  }

  update(id:number,artifact:Artifact){

    return this.http.put(`${this.api}/${id}`,artifact);

  }

  delete(id:number){

    return this.http.delete(`${this.api}/${id}`);

  }

}

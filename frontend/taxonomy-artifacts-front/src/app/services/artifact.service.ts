import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Artifact, ClassifiedArtifact } from '../models/artifact';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtifactService {

  private api = `${environment.apiUrl}/artifacts`;

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

  uploadImage(file: File) {

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ image_url: string }>(
      `${this.api}/upload-image`,
      formData
    );

  }

  getClassified(id: number): Observable<ClassifiedArtifact> {

    return this.http.get<ClassifiedArtifact>(`${this.api}/${id}/classified`);

  }

  listClassified(): Observable<ClassifiedArtifact[]> {

    return this.http.get<ClassifiedArtifact[]>(`${this.api}/classified`);

  }

}
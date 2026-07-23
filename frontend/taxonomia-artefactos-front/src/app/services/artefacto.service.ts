import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Artefacto } from '../models/artefacto';

@Injectable({
  providedIn: 'root'
})
export class ArtefactoService {

  private api = "http://127.0.0.1:8000/artefactos";

  constructor(private http: HttpClient) { }

  listar(): Observable<Artefacto[]> {

    return this.http.get<Artefacto[]>(this.api);

  }

  obtener(id:number): Observable<Artefacto>{

    return this.http.get<Artefacto>(`${this.api}/${id}`);

  }

  crear(artefacto:Artefacto){

    return this.http.post(this.api,artefacto);

  }

  actualizar(id:number,artefacto:Artefacto){

    return this.http.put(`${this.api}/${id}`,artefacto);

  }

  eliminar(id:number){

    return this.http.delete(`${this.api}/${id}`);

  }

}
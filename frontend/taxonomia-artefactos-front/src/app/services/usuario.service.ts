import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private api = "http://127.0.0.1:8000/usuarios";

  constructor(private http: HttpClient) { }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  obtener(id:number): Observable<Usuario>{

    return this.http.get<Usuario>(`${this.api}/${id}`);

  }

  crear(usuario:Usuario){

    return this.http.post(this.api,usuario);

  }

  actualizar(id:number,usuario:Usuario){

    return this.http.put(`${this.api}/${id}`,usuario);

  }

  eliminar(id:number){

    return this.http.delete(`${this.api}/${id}`);

  }

}
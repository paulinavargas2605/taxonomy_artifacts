import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Filo, Clase, Orden, Familia, Genero, Especie } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private api = "http://127.0.0.1:8000/categories";

  constructor(private http: HttpClient) { }

  listPhyla(): Observable<Filo[]> {

    return this.http.get<Filo[]>(`${this.api}/filos`);

  }

  listClasses(idFilo: number): Observable<Clase[]> {

    return this.http.get<Clase[]>(`${this.api}/clases`, {
      params: { id_filo: idFilo }
    });

  }

  listOrders(idClase: number): Observable<Orden[]> {

    return this.http.get<Orden[]>(`${this.api}/ordenes`, {
      params: { id_clase: idClase }
    });

  }

  listFamilies(idOrden: number): Observable<Familia[]> {

    return this.http.get<Familia[]>(`${this.api}/familias`, {
      params: { id_orden: idOrden }
    });

  }

  listGenera(idFamilia: number): Observable<Genero[]> {

    return this.http.get<Genero[]>(`${this.api}/generos`, {
      params: { id_familia: idFamilia }
    });

  }

  listSpecies(idGenero: number): Observable<Especie[]> {

    return this.http.get<Especie[]>(`${this.api}/especies`, {
      params: { id_genero: idGenero }
    });

  }

}

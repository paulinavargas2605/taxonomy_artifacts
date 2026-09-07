import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Phylum, TaxonomicClass, Order, Family, Genus, Species, Classification } from '../models/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  listPhyla(): Observable<Phylum[]> {

    return this.http.get<Phylum[]>(`${this.api}/phyla`);

  }

  listClasses(idPhylum: number): Observable<TaxonomicClass[]> {

    return this.http.get<TaxonomicClass[]>(`${this.api}/classes`, {
      params: { id_phylum: idPhylum }
    });

  }

  listOrders(idClass: number): Observable<Order[]> {

    return this.http.get<Order[]>(`${this.api}/orders`, {
      params: { id_class: idClass }
    });

  }

  listFamilies(idOrder: number): Observable<Family[]> {

    return this.http.get<Family[]>(`${this.api}/families`, {
      params: { id_order: idOrder }
    });

  }

  listGenera(idFamily: number): Observable<Genus[]> {

    return this.http.get<Genus[]>(`${this.api}/genera`, {
      params: { id_family: idFamily }
    });

  }

  listSpecies(idGenus: number): Observable<Species[]> {

    return this.http.get<Species[]>(`${this.api}/species`, {
      params: { id_genus: idGenus }
    });

  }

  getSpecies(idSpecies: number): Observable<Species> {

    return this.http.get<Species>(`${this.api}/species/${idSpecies}`);

  }

  getClassification(idSpecies: number): Observable<Classification> {

    return this.http.get<Classification>(`${this.api}/classification/${idSpecies}`);

  }

}
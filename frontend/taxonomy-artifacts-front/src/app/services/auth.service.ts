import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = "http://127.0.0.1:8000/auth";

  private currentUserSubject = new BehaviorSubject<User | null>(this.readStoredUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private readStoredUser(): User | null {

    const stored = localStorage.getItem('currentUser');

    return stored ? JSON.parse(stored) : null;

  }

  login(username: string, password: string): Observable<User> {

    return this.http.post<User>(`${this.api}/login`, { username, password }).pipe(

      tap((user) => {

        localStorage.setItem('currentUser', JSON.stringify(user));

        this.currentUserSubject.next(user);

      })

    );

  }

  logout() {

    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

  }

  getCurrentUser(): User | null {

    return this.currentUserSubject.value;

  }

  isLoggedIn(): boolean {

    return this.currentUserSubject.value !== null;

  }

}
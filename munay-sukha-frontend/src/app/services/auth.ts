import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegistroRequest } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/api/auth';
  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private nameKey = 'userName';

  constructor(private http: HttpClient) { }

  // 1. Iniciar Sesión
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
          this.saveRole(response.rol);
          this.saveName(response.nombre);
        }
      })
    );
  }

  // 2. Registrarse
  register(datos: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos);
  }


  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private saveName(name: string): void {
    localStorage.setItem(this.nameKey, name);
  }

  private saveRole(rol: string): void {
    localStorage.setItem(this.roleKey, rol);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.nameKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.nameKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
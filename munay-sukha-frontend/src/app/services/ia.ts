import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PromptRequest {
  texto: string;
}

export interface RecomendacionResponse {
  mensaje: string;
  nombresProductosIA: string[];
}

@Injectable({
  providedIn: 'root'
})
export class IaService {

  private apiUrl = '/api/ia/recomendar';

  constructor(private http: HttpClient) { }

  recomendar(texto: string): Observable<RecomendacionResponse> {
    return this.http.post<RecomendacionResponse>(this.apiUrl, { texto });
  }
}

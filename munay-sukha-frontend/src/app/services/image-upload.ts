import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private readonly apiKey = '83040bf2367075c73f1a2b1dd048463c';
  private readonly apiUrl = 'https://api.imgbb.com/1/upload';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, formData);
  }
}
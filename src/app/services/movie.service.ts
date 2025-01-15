import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  searchMovies(title: string): Observable<any> {
    const url = `${this.apiUrl}?s=${title}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  getMovieDetails(id: string): Observable<any> {
    const url = `${this.apiUrl}/movie/${id}&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}

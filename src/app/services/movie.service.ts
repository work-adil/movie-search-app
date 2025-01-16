import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { GetMoviesResult } from '../models/movie-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.apiUrl;
  private apiKey = environment.apiKey;

  constructor(private http: HttpClient) { }

  searchMovies(title: string): Observable<GetMoviesResult> {
    const url = `${this.apiUrl}?s=${title}&apikey=${this.apiKey}`;
    return this.http.get<GetMoviesResult>(url);
  }
}

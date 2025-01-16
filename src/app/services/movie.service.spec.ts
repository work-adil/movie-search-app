import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { environment } from '../environments/environment';
import { GetMoviesResult, MovieResponse } from '../models/movie-response.model';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch movies based on title', () => {
    const dummyMovies: GetMoviesResult = {
      isSuccess: true,
      message: "",
      errors: [],
      errorCode: 0,
      responseStatusCode: 200,
      result: [
        { title: 'Inception', year: '2010', poster: 'url-to-poster' },
        { title: 'Interstellar', year: '2014', poster: 'url-to-poster' }
      ]
    };

    service.searchMovies('Movie').subscribe(movies => {
      let moviesResult = movies.result as MovieResponse[]
      expect(moviesResult.length).toBe(2);
      expect(moviesResult).toEqual(dummyMovies.result!);
    });

    const request = httpMock.expectOne(`${environment.apiUrl}?s=Movie&apikey=${environment.apiKey}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyMovies);
  });
});

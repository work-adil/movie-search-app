import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { MovieService } from '../../services/movie.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../movies/movie-card/movie-card.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieService: MovieService;

  const mockMovies = [
    { title: 'Movie 1', year: '2021', poster: 'posterurl1' },
    { title: 'Movie 2', year: '2022', poster: 'posterurl2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, MoviesComponent, MovieCardComponent], // Add MoviesComponent to imports
      providers: [MovieService]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.movies).toEqual([]);
    expect(component.searchTitle).toBe('');
    expect(component.isLoading).toBe(false);
    expect(component.noResults).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should handle no results', () => {
    spyOn(movieService, 'searchMovies').and.returnValue(of({ isSuccess: true, message: '', errors: [], errorCode: 0, responseStatusCode: 200, result: [] }));
    component.searchTitle = 'Non-existent Movie';
    component.onSearchTitleEnter();
    fixture.detectChanges();
    expect(component.movies.length).toBe(0);
    expect(component.noResults).toBe(true);
  });

  it('should handle errors', () => {
    const errorMessage = 'An error occurred while fetching movies. Please try again later.';
    spyOn(movieService, 'searchMovies').and.returnValue(throwError({ error: { Message: errorMessage } }));
    component.searchTitle = 'Movie';
    component.onSearchTitleEnter();
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe(errorMessage);
  });

  it('should reset search', () => {
    component.resetSearch();
    expect(component.movies).toEqual([]);
    expect(component.isLoading).toBe(false);
    expect(component.noResults).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should display movies when search is successful', () => {
    spyOn(movieService, 'searchMovies').and.returnValue(of({ isSuccess: true, message: '', errors: [], errorCode: 0, responseStatusCode: 200, result: mockMovies }));
    component.searchTitle = 'Movie';
    component.onSearchButtonClick();
    fixture.detectChanges();
    expect(component.movies.length).toBe(2);
    expect(component.noResults).toBe(false);
  });
});

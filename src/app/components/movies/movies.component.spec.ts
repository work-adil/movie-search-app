import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult } from '../../models/movie-response.model';
import { MoviesComponent } from './movies.component';
import { MovieCardComponent } from '../movies/movie-card/movie-card.component';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, MoviesComponent, MovieCardComponent], // Ensure standalone components are in imports
      providers: [MovieService]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);

    // Assign a mock movie object to the movies array
    component.movies = [{ title: 'Inception', year: '2010', poster: 'url-to-poster' }];

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchMovies and update movies on valid input', () => {
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

    spyOn(movieService, 'searchMovies').and.returnValue(of(dummyMovies));

    component.searchTitle = 'Movie';
    component.onSearchTitleChange();

    expect(movieService.searchMovies).toHaveBeenCalledWith('Movie');
    expect(component.isLoading).toBeFalse();
    expect(component.noResults).toBeFalse();
    expect(component.movies.length).toBe(2);
  });

  it('should handle empty search results', () => {
    const emptyMovies: GetMoviesResult = {
      result: [], isSuccess: true,
      message: "",
      errors: [],
      errorCode: 0,
      responseStatusCode: 200,
    };

    spyOn(movieService, 'searchMovies').and.returnValue(of(emptyMovies));

    component.searchTitle = 'Nonexistent Movie';
    component.onSearchTitleChange();

    expect(movieService.searchMovies).toHaveBeenCalledWith('Nonexistent Movie');
    expect(component.isLoading).toBeFalse();
    expect(component.noResults).toBeTrue();
    expect(component.movies.length).toBe(0);
  });

  it('should handle errors from searchMovies', () => {
    spyOn(movieService, 'searchMovies').and.returnValue(throwError(() => new Error('Error fetching movies')));

    component.searchTitle = 'Error Movie';
    component.onSearchTitleChange();

    expect(movieService.searchMovies).toHaveBeenCalledWith('Error Movie');
    expect(component.isLoading).toBeFalse();
    expect(component.noResults).toBeFalse();
    expect(component.errorMessage).toBe('An error occurred while fetching movies. Please try again later.');
  });
});

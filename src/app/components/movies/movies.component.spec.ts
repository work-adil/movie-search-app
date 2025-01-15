import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MoviesComponent } from './movies.component';
import { MovieService } from '../../services/movie.service';
import { of } from 'rxjs';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesComponent, HttpClientTestingModule, FormsModule], // Import MoviesComponent
      providers: [MovieService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve movies on search', () => {
    const dummyMoviesResponse = {
      result: [
        { title: 'Inception', year: '2010', poster: 'url-to-poster' },
        { title: 'Interstellar', year: '2014', poster: 'url-to-poster' }
      ]
    };

    spyOn(movieService, 'searchMovies').and.returnValue(of(dummyMoviesResponse));

    component.searchTitle = 'inception';
    component.search();

    expect(component.movies.length).toBe(2);
    expect(component.movies).toEqual(dummyMoviesResponse.result);
  });
});

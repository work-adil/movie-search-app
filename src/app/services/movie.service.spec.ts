import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MoviesComponent } from '../components/movies/movies.component';
import { MovieService } from '../services/movie.service';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let movieService: MovieService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoviesComponent],
      imports: [HttpClientTestingModule, FormsModule], // Ensure HttpClientTestingModule is imported
      providers: [MovieService]
    })
      .compileComponents();
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
      Result: [
        { Title: 'Inception', Year: '2010', Poster: 'url-to-poster' },
        { Title: 'Interstellar', Year: '2014', Poster: 'url-to-poster' }
      ]
    };

    spyOn(movieService, 'searchMovies').and.returnValue(of(dummyMoviesResponse));

    component.searchTitle = 'inception';
    component.search();

    expect(component.movies.length).toBe(2);
    expect(component.movies).toEqual(dummyMoviesResponse.Result);
  });
});

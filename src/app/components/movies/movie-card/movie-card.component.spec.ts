import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { MovieResponse } from '../../../models/movie-response.model';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let element: DebugElement;

  const mockMovie: MovieResponse = {
    title: 'Test Movie',
    year: '2022',
    poster: 'https://example.com/poster.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    component.movie = mockMovie;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display movie title', () => {
    const titleElement = element.query(By.css('.card-title')).nativeElement;
    expect(titleElement.textContent).toContain(mockMovie.title);
  });

  it('should display movie year', () => {
    const yearElement = element.query(By.css('.card-text')).nativeElement;
    expect(yearElement.textContent).toContain(`Released: ${mockMovie.year}`);
  });

  it('should display movie poster', () => {
    const posterElement = element.query(By.css('.card-img-top')).nativeElement;
    expect(posterElement.src).toBe(mockMovie.poster);
  });
});

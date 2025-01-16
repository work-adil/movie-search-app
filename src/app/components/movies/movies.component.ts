import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult, MovieResponse } from '../../models/movie-response.model';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { MovieCardComponent } from '../movies/movie-card/movie-card.component'

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {
  movies: MovieResponse[] = [];  // Array to store movie results
  searchTitle: string = '';      // Search query input from the user
  isLoading: boolean = false;    // Flag to indicate loading state
  noResults: boolean = false;    // Flag to show message when no movies are found
  errorMessage: string = '';     // Error message when something goes wrong

  private searchSubject: Subject<string> = new Subject<string>(); // Subject to handle input
  private destroy$ = new Subject<void>(); // Subject to signal when the component is destroyed

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    // Subscribe to the search input and apply debounce
    this.searchSubject.pipe(
      debounceTime(500), // Wait for 500ms of inactivity before making the request
      switchMap((searchTitle) => {
        if (searchTitle.trim() && searchTitle.trim().length >= 3) { // Check for minimum length
          this.isLoading = true;
          this.noResults = false; // Reset no results message before making the request
          this.errorMessage = '';  // Reset error message before making the request
          return this.movieService.searchMovies(searchTitle).pipe(
            catchError((error) => {
              this.isLoading = false;
              this.errorMessage = error?.error?.Message || error?.error || 'An error occurred while fetching movies. Please try again later.';
              return of([]); // Use 'of' to return an observable with an empty array
            })
          );
        } else {
          this.isLoading = false;
          return of([]); // Use 'of' to return an observable with an empty array
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      (response: GetMoviesResult | never[]) => {
        this.isLoading = false;
        if (response && (response as GetMoviesResult).isSuccess) {
          const result = (response as GetMoviesResult).result as MovieResponse[];
          this.movies = result.length > 0 ? result : [];
          this.noResults = result.length === 0;
        } else {
          this.noResults = true;
        }
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // This method will be triggered on input change
  onSearchTitleChange(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearchTitleEnter();
    } else {
      if (this.searchTitle.trim() === '') {
        this.resetSearch();
      } else {
        this.noResults = false; // Reset no results message
        this.errorMessage = '';  // Reset error message

        // Push the search query to the subject
        this.searchSubject.next(this.searchTitle);
      }
    }
  }

  // This method will be triggered when Enter key is pressed
  onSearchTitleEnter() {
    if (this.searchTitle.trim() === '') {
      this.resetSearch();
    } else {
      this.performImmediateSearch();
    }
  }

  // This method will be triggered when the search button is clicked
  onSearchButtonClick() {
    if (this.searchTitle.trim() === '') {
      this.resetSearch();
    } else {
      this.performImmediateSearch();
    }
  }

  // Reset search state
  resetSearch() {
    this.movies = [];
    this.isLoading = false;
    this.noResults = false;
    this.errorMessage = '';
  }

  // Perform immediate search
  performImmediateSearch() {
    this.noResults = false; // Reset no results message
    this.errorMessage = '';  // Reset error message
    this.isLoading = true;

    this.movieService.searchMovies(this.searchTitle).pipe(
      catchError((error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.Message || error?.error || 'An error occurred while fetching movies. Please try again later.';
        return of([]); // Use 'of' to return an observable with an empty array
      }),
      takeUntil(this.destroy$)
    ).subscribe(
      (response: GetMoviesResult | never[]) => {
        this.isLoading = false;
        if (response && (response as GetMoviesResult).isSuccess) {
          const result = (response as GetMoviesResult).result as MovieResponse[];
          this.movies = result.length > 0 ? result : [];
          this.noResults = result.length === 0;
        } else {
          this.noResults = true;
        }
      }
    );
  }
}

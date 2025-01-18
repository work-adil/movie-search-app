import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult, MovieResponse } from '../../models/movie-response.model';
import { Subject, merge, of } from 'rxjs';
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

  private searchSubject: Subject<void> = new Subject<void>(); // Subject to handle input
  private destroy$ = new Subject<void>(); // Subject to signal when the component is destroyed
  private immediateSearch = new Subject<void>(); // Subject to signal when immediate search

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    merge(this.searchSubject.pipe(
        debounceTime(500), // Wait for 500ms of inactivity before making the request
      ),
      this.immediateSearch).pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.fetchMovies(this.searchTitle))
      ).subscribe(
        (response: GetMoviesResult) => {
          this.handleSearchResponse(response);
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
        this.searchSubject.next();
      }
    }
  }

  // This method will be triggered when Enter key is pressed
  onSearchTitleEnter() {
      this.performImmediateSearch();
  }

  // This method will be triggered when the search button is clicked
  onSearchButtonClick() {
      this.performImmediateSearch();
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
    if (this.searchTitle.trim() === '') 
      this.resetSearch();
    this.immediateSearch.next();
  }

  private fetchMovies(searchTitle: string) {
    this.isLoading = true;
    this.noResults = false;
    this.errorMessage = '';

    return this.movieService.searchMovies(searchTitle).pipe(
      catchError((error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.Message || error?.error || 'An error occurred while fetching movies. Please try again later.';
        return of({} as GetMoviesResult);
      })
    );
  }

  private handleSearchResponse(response: GetMoviesResult) {
    this.isLoading = false;
    if (response && (response as GetMoviesResult).isSuccess) {
      const result = (response as GetMoviesResult).result as MovieResponse[];
      this.movies = result.length > 0 ? result : [];
      this.noResults = result.length === 0;
    } else {
      this.noResults = true;

    }
  }
}

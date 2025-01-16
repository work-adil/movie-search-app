import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult, MovieResponse } from '../../models/movie-response.model';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
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
  private searchSubscription: Subscription = new Subscription(); // To manage the subscription
  private immediateSearchSubscription: Subscription = new Subscription(); // Subscription for immediate search

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    // Subscribe to the search input and apply debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500), // Wait for 500ms of inactivity before making the request
      switchMap((searchTitle) => {
        if (searchTitle.trim()) {
          this.isLoading = true;
          this.noResults = false; // Reset no results message before making the request
          this.errorMessage = '';  // Reset error message before making the request
          return this.movieService.searchMovies(searchTitle).pipe(
            catchError((error) => {
              this.isLoading = false;
              var errorMsg = error?.error;
              if (errorMsg)
                this.errorMessage = errorMsg.message ? errorMsg.message : errorMsg;
              else
                this.errorMessage = 'An error occurred while fetching movies. Please try again later.';
              return of([]); // Use 'of' to return an observable with an empty array
            })
          );
        } else {
          this.isLoading = false;
          return of([]); // Use 'of' to return an observable with an empty array
        }
      })
    ).subscribe(
      (response: GetMoviesResult | never[]) => {
        this.isLoading = false;
        if (response && (response as GetMoviesResult).isSuccess) {
          const result = (response as GetMoviesResult).result as MovieResponse[];
          if (result.length > 0) {
            this.movies = result;
            this.noResults = false;
          } else {
            this.noResults = true;
          }
        } else {
          this.noResults = true;
        }
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.immediateSearchSubscription) {
      this.immediateSearchSubscription.unsubscribe();
    }
  }

  // This method will be triggered on input change
  onSearchTitleChange(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearchTitleEnter();
    } else {
      this.noResults = false; // Reset no results message
      this.errorMessage = '';  // Reset error message

      // Push the search query to the subject
      this.searchSubject.next(this.searchTitle);
    }
  }

  // This method will be triggered when Enter key is pressed
  onSearchTitleEnter() {
    this.cancelDebouncedSearch();
    this.performImmediateSearch();
  }

  // This method will be triggered when the search button is clicked
  onSearchButtonClick() {
    this.cancelDebouncedSearch();
    this.performImmediateSearch();
  }

  // Cancel the debounced search
  cancelDebouncedSearch() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
      this.searchSubscription = new Subscription();
    }
  }

  // Perform immediate search
  performImmediateSearch() {
    this.noResults = false; // Reset no results message
    this.errorMessage = '';  // Reset error message
    this.isLoading = true;

    this.immediateSearchSubscription = this.movieService.searchMovies(this.searchTitle).pipe(
      catchError((error) => {
        this.isLoading = false;
        var errorMsg = error?.error;
        if (errorMsg)
          this.errorMessage = errorMsg.message ? errorMsg.message : errorMsg;
        else
          this.errorMessage = 'An error occurred while fetching movies. Please try again later.';
        return of([]); // Use 'of' to return an observable with an empty array
      })
    ).subscribe(
      (response: GetMoviesResult | never[]) => {
        this.isLoading = false;
        if (response && (response as GetMoviesResult).isSuccess) {
          const result = (response as GetMoviesResult).result as MovieResponse[];
          if (result.length > 0) {
            this.movies = result;
            this.noResults = false;
          } else {
            this.noResults = true;
          }
        } else {
          this.noResults = true;
        }
      }
    );
  }
}

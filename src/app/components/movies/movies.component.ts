import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult, MovieResponse } from '../../models/movie-response.model';
import { Subject, Subscription } from 'rxjs';
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

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    // Subscribe to the search input and apply debounce
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500), // Wait for 500ms of inactivity before making the request
      switchMap((searchTitle) => {
        if (searchTitle.trim()) {
          return this.movieService.searchMovies(searchTitle); // Make the search request
        } else {
          return []; // Return an empty array if no search term
        }
      }),
      catchError((error) => {
        console.error('Error fetching movies:', error);
        this.isLoading = false;
        this.errorMessage = 'An error occurred while fetching movies. Please try again later.';
        return [];
      })
    ).subscribe(
      (response: GetMoviesResult | []) => {
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
  }

  // This method will be triggered on input change
  onSearchTitleChange() {
    this.noResults = false; // Reset no results message
    this.errorMessage = '';  // Reset error message

    // Push the search query to the subject
    this.searchSubject.next(this.searchTitle);
  }
}

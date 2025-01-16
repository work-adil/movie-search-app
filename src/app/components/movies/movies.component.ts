import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { GetMoviesResult, MovieResponse } from '../../models/movie-response.model';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  movies: MovieResponse[] = [];    // Array to store movie results
  searchTitle: string = '';        // Search query input from the user
  isLoading: boolean = false;      // Flag to indicate loading state
  noResults: boolean = false;      // Flag to show message when no movies are found
  errorMessage: string = '';       // Error message when something goes wrong

  constructor(private movieService: MovieService) { }

  // Method to search for movies
  search() {
    // Clear previous results and messages
    this.movies = [];
    this.noResults = false;
    this.errorMessage = '';

    // Validate if search title is not empty
    if (!this.searchTitle.trim()) {
      return; // Exit if search input is empty
    }

    // Show loading spinner
    this.isLoading = true;

    // Call the movie service to get movies by title
    this.movieService.searchMovies(this.searchTitle).subscribe(
      (response: GetMoviesResult) => {
        this.isLoading = false; // Hide loading spinner

        if (response.isSuccess && response.result && response.result.length > 0) {
          this.movies = response.result;
        } else {
          this.noResults = true;
        }
      },
      (error) => {
        this.isLoading = false; 
        console.error('Error fetching movies:', error);

        var errorResponse = error?.error
        if (errorResponse)
          this.errorMessage = errorResponse.Message ? errorResponse.Message : errorResponse;
        else
          this.errorMessage = 'An error occurred while fetching movies. Please try again later.';
      }
    );
  }
}

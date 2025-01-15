import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  movies: any[] = [];
  searchTitle: string = '';

  constructor(private movieService: MovieService) { }

  search() {
    this.movieService.searchMovies(this.searchTitle).subscribe(response => {
      this.movies = response.result;
      console.log(this.movies)
    });
  }
}

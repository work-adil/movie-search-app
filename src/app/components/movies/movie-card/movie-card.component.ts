import { Component, Input } from '@angular/core';
import { MovieResponse } from '../../../models/movie-response.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,  
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: MovieResponse;  // Input property for the movie data
}

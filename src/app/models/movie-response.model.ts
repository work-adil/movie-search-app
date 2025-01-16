import { GenericBaseResult } from "./base-result.model";

export interface MovieResponse {
  title: string;
  year: string;
  poster: string;
}

export interface GetMoviesResult extends GenericBaseResult<MovieResponse[]> { }

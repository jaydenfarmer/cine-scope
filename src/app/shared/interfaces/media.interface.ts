export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
  adult?: boolean;
  original_language?: string;
  popularity?: number;
}

export interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TrailerData {
  media: Media;
  trailers: Trailer[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface FilterOptions {
  sortBy?: string;
  year?: number;
  genre?: number[];
  rating?: number;
}

export type MediaType = 'movie' | 'tv';
export type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';

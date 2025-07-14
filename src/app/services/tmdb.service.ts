import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import {
  Media,
  ApiResponse,
  Trailer,
  MediaType,
} from '../shared/interfaces/media.interface';
import {
  API_CONFIG,
  IMAGE_SIZES,
  BACKDROP_SIZES,
} from '../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly apiKey = this.getApiKey();
  private baseUrl = API_CONFIG.BASE_URL;
  private movieGenreMap: { [key: string]: number } = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    'Science Fiction': 878,
    'TV Movie': 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
  };

  private tvGenreMap: { [key: string]: number } = {
    'Action & Adventure': 10759,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Kids: 10762,
    Mystery: 9648,
    News: 10763,
    Reality: 10764,
    'Sci-Fi & Fantasy': 10765,
    Soap: 10766,
    Talk: 10767,
    'War & Politics': 10768,
    Western: 37,
  };

  private movieCertificationMap: { [key: string]: string } = {
    NR: 'NR',
    G: 'G',
    PG: 'PG',
    'PG-13': 'PG-13',
    R: 'R',
    'NC-17': 'NC-17',
  };

  private tvCertificationMap: { [key: string]: string } = {
    NR: 'NR',
    'TV-Y': 'TV-Y',
    'TV-Y7': 'TV-Y7',
    'TV-G': 'TV-G',
    'TV-PG': 'TV-PG',
    'TV-14': 'TV-14',
    'TV-MA': 'TV-MA',
  };

  constructor(private http: HttpClient) {}

  private getApiKey(): string {
    // Try environment first, then fallback to global process
    if (environment.tmdbApiKey) {
      return environment.tmdbApiKey;
    }

    // Fallback for Vercel deployment
    return (globalThis as any)?.process?.env?.['NG_APP_TMDB_API_KEY'] || '';
  }

  getTrendingMovies(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}`
    );
  }

  getTrendingTvShows(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/trending/tv/week?api_key=${this.apiKey}`
    );
  }

  getLatestTrailers(
    category: 'popular' | 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters'
  ) {
    switch (category) {
      case 'popular':
        return this.http.get<any>(
          `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`
        );
      case 'streaming':
        return this.http.get<any>(
          `${this.baseUrl}/trending/movie/week?api_key=${this.apiKey}&language=en-US`
        );
      case 'on_tv':
        return this.http.get<any>(
          `${this.baseUrl}/tv/airing_today?api_key=${this.apiKey}&language=en-US&page=1`
        );
      case 'for_rent':
        return this.http.get<any>(
          `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=en-US&page=1`
        );
      case 'in_theaters':
        return this.http.get<any>(
          `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&language=en-US&page=1`
        );
      default:
        return this.http.get<any>(
          `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`
        );
    }
  }

  getUpcomingTrailers(type: 'movie' | 'tv' = 'movie') {
    const endpoint = type === 'movie' ? 'movie/upcoming' : 'tv/on_the_air';
    return this.http.get<any>(
      `${this.baseUrl}/${endpoint}?api_key=${this.apiKey}&language=en-US&page=1`
    );
  }

  getWhatsPopular(type: 'movie' | 'tv' = 'movie') {
    const endpoint = type === 'movie' ? 'movie/popular' : 'tv/popular';
    return this.http.get<any>(
      `${this.baseUrl}/${endpoint}?api_key=${this.apiKey}&language=en-US&page=1`
    );
  }

  getFreeToWatch(type: 'movie' | 'tv' = 'movie') {
    const endpoint = type === 'movie' ? 'movie/top_rated' : 'tv/top_rated';
    return this.http.get<any>(
      `${this.baseUrl}/${endpoint}?api_key=${this.apiKey}&language=en-US&page=1`
    );
  }

  searchMovies(query: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${query}`
    );
  }

  searchTvShows(query: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/search/tv?api_key=${this.apiKey}&query=${query}`
    );
  }

  searchPeople(query: string) {
    return this.http.get<any>(
      `${this.baseUrl}/search/person?api_key=${
        this.apiKey
      }&query=${encodeURIComponent(query)}`
    );
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}`);
  }

  getTvDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/tv/${id}?api_key=${this.apiKey}`);
  }

  getMovieTrailers(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/videos?api_key=${this.apiKey}`
    );
  }

  getMovieCredits(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}`
    );
  }

  getTvTrailers(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/tv/${id}/videos?api_key=${this.apiKey}`
    );
  }

  getTvCredits(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/tv/${id}/credits?api_key=${this.apiKey}`
    );
  }

  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`
    );
  }

  getTopRatedMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/top_rated?api_key=${this.apiKey}&page=${page}`
    );
  }
  getUpcomingMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&page=${page}`
    );
  }

  getNowPlayingMovies(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/now_playing?api_key=${this.apiKey}&page=${page}`
    );
  }

  getPopularTvShows(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/tv/popular?api_key=${this.apiKey}&page=${page}`
    );
  }

  getTopRatedTvShows(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/tv/top_rated?api_key=${this.apiKey}&page=${page}`
    );
  }

  getAiringTodayTvShows(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/tv/airing_today?api_key=${this.apiKey}&page=${page}`
    );
  }

  getPopularPeople(page: number = 1): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/popular?api_key=${this.apiKey}&page=${page}`
    );
  }

  getPersonDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/person/${id}?api_key=${this.apiKey}`);
  }

  getPersonCombinedCredits(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/person/${id}/combined_credits?api_key=${this.apiKey}`
    );
  }

  getMovieProviders(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/watch/providers/movie?api_key=${this.apiKey}&language=en-US`
    );
  }

  getFilteredMedia(
    filters: any,
    page: number = 1,
    mediaType: 'movie' | 'tv' = 'movie',
    isUpcomingPage: boolean = false
  ): Observable<any> {
    const hasFilters =
      filters &&
      Object.keys(filters).length > 0 &&
      ((filters.genres && filters.genres.length > 0) ||
        (filters.certifications && filters.certifications.length > 0) ||
        (filters.providers && filters.providers.length > 0) ||
        (filters.sortField && filters.sortField !== '') ||
        (filters.language && filters.language !== '') ||
        (filters.userScore && filters.userScore > 0) ||
        (filters.minVotes && filters.minVotes > 0) ||
        (filters.runtime && filters.runtime > 0) ||
        (filters.releaseFrom && filters.releaseFrom !== '') ||
        (filters.releaseTo && filters.releaseTo !== '') ||
        (filters.keywords && filters.keywords !== ''));

    if (!hasFilters) {
      if (mediaType === 'movie') {
        if (isUpcomingPage) {
          return this.getUpcomingMovies(page);
        } else {
          return this.getPopularMovies(page);
        }
      } else {
        return this.getPopularTvShows(page);
      }
    }

    let params = [];

    if (filters.genres?.length) {
      params.push(`with_genres=${filters.genres.join(',')}`);
    }

    if (filters.certifications?.length) {
      params.push(`certification=${filters.certifications.join('|')}`);
      params.push('certification_country=US');
    }

    if (filters.providers?.length) {
      params.push(`with_watch_providers=${filters.providers.join(',')}`);
      params.push('watch_region=US');
    }
    if (filters.sortField) params.push(`sort_by=${filters.sortField}`);
    if (filters.language && filters.language !== '')
      params.push(`with_original_language=${filters.language}`);
    if (filters.userScore) params.push(`vote_average.gte=${filters.userScore}`);
    if (filters.minVotes) params.push(`vote_count.gte=${filters.minVotes}`);
    if (filters.runtime) params.push(`with_runtime.gte=${filters.runtime}`);

    if (isUpcomingPage && mediaType === 'movie') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      params.push(`primary_release_date.gte=${tomorrowString}`);

      if (filters.releaseTo && filters.releaseTo !== '') {
        const userToDate = new Date(filters.releaseTo);
        if (userToDate > tomorrow) {
          params.push(`primary_release_date.lte=${filters.releaseTo}`);
        }
      }
    } else {
      if (filters.releaseFrom)
        params.push(`primary_release_date.gte=${filters.releaseFrom}`);
      if (filters.releaseTo)
        params.push(`primary_release_date.lte=${filters.releaseTo}`);
    }

    if (filters.keywords) params.push(`with_keywords=${filters.keywords}`);

    if (mediaType === 'tv') {
      params.push('language=en-US');
      params.push('timezone=America/New_York');
      params.push('include_null_first_air_dates=false');
    }

    if (mediaType === 'movie') {
      params.push('language=en-US');
      params.push('region=US');
    }
    const queryString = params.join('&');
    const url = `${this.baseUrl}/discover/${mediaType}?api_key=${this.apiKey}&page=${page}&${queryString}`;

    return this.http.get<any>(url);
  }
}

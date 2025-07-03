import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from "../../components/media-card/media-card.component";
import { PeopleCardComponent } from "../../components/people-card/people-card.component";
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, startWith, catchError, share } from 'rxjs/operators';

// ✅ Better interface with proper typing
interface SearchResults {
  movies: any[];
  tvShows: any[];
  people: any[];
  totalMovieResults: number;
  totalTvResults: number;
  totalPeopleResults: number;
  isLoading: boolean;
  error: string | null;
  query: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, PeopleCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  selectedCategory: 'movies' | 'tv' | 'people' = 'movies';
  searchResults$!: Observable<SearchResults>;

  constructor(
    private tmdb: TmdbService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchResults$ = this.route.queryParams.pipe(
      map(params => (params['search'] || '').trim()),
      switchMap(query => this.performSearch(query)),
      share()
    );
  }

  // ✅ Extracted search logic for better readability
  private performSearch(query: string): Observable<SearchResults> {
    // ✅ Handle empty or short queries
    if (!query || query.length < 2) {
      return of(this.createEmptyResults(query));
    }

    // ✅ Loading state
    const loadingState = this.createLoadingResults(query);

    // ✅ Parallel API calls with individual error handling
    const searchCalls$ = combineLatest([
      this.tmdb.searchMovies(query).pipe(
        catchError(err => this.handleSearchError('Movies', err))
      ),
      this.tmdb.searchTvShows(query).pipe(
        catchError(err => this.handleSearchError('TV Shows', err))
      ),
      this.tmdb.searchPeople(query).pipe(
        catchError(err => this.handleSearchError('People', err))
      )
    ]);

    return searchCalls$.pipe(
      map(([movies, tv, people]) => this.createSuccessResults(query, movies, tv, people)),
      catchError(error => this.handleGlobalError(query, error)),
      startWith(loadingState)
    );
  }

  // ✅ Helper methods for creating results objects
  private createEmptyResults(query: string): SearchResults {
    return {
      movies: [],
      tvShows: [],
      people: [],
      totalMovieResults: 0,
      totalTvResults: 0,
      totalPeopleResults: 0,
      isLoading: false,
      error: null,
      query
    };
  }

  private createLoadingResults(query: string): SearchResults {
    return {
      ...this.createEmptyResults(query),
      isLoading: true
    };
  }

  private createSuccessResults(
    query: string, 
    movies: any, 
    tv: any, 
    people: any
  ): SearchResults {
    return {
      movies: movies?.results || [],
      tvShows: tv?.results || [],
      people: people?.results || [],
      totalMovieResults: movies?.total_results || 0,
      totalTvResults: tv?.total_results || 0,
      totalPeopleResults: people?.total_results || 0,
      isLoading: false,
      error: null,
      query
    };
  }

  // ✅ Better error handling
  private handleSearchError(category: string, error: any): Observable<any> {
    console.warn(`${category} search failed:`, error);
    return of({ results: [], total_results: 0 });
  }

  private handleGlobalError(query: string, error: any): Observable<SearchResults> {
    console.error('Search failed:', error);
    return of({
      ...this.createEmptyResults(query),
      error: 'Search failed. Please try again.'
    });
  }

  // ✅ Safe category switching
  setCategory(category: 'movies' | 'tv' | 'people'): void {
    this.selectedCategory = category;
  }

  // ✅ Performance optimization
  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }

  // ✅ Template helper methods
  hasResults(results: SearchResults): boolean {
    return results.totalMovieResults > 0 || 
           results.totalTvResults > 0 || 
           results.totalPeopleResults > 0;
  }

  getCurrentResults(results: SearchResults): any[] {
    switch (this.selectedCategory) {
      case 'movies': return results.movies;
      case 'tv': return results.tvShows;
      case 'people': return results.people;
      default: return [];
    }
  }

  getCurrentTotal(results: SearchResults): number {
    switch (this.selectedCategory) {
      case 'movies': return results.totalMovieResults;
      case 'tv': return results.totalTvResults;
      case 'people': return results.totalPeopleResults;
      default: return 0;
    }
  }
}
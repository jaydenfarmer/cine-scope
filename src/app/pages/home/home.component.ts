import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';

import { TmdbService } from '../../services/tmdb.service';
import { MediaRowComponent } from '../../components/media-row/media-row.component';
import { TrailerRowComponent } from '../../components/trailer-row/trailer-row.component';
import { Media, Trailer } from '../../shared/interfaces/media.interface';

// ✅ Better type definitions
interface TrailerData {
  media: Media;
  trailers: Trailer[];
}

type TrendingType = 'movie' | 'tv';
type TrailersCategory =
  | 'popular'
  | 'streaming'
  | 'on_tv'
  | 'for_rent'
  | 'in_theaters';
type PopularCategory = 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters';
type FreeType = 'movie' | 'tv';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaRowComponent, TrailerRowComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // ✅ Properly typed properties with defaults
  trendingItems: Media[] = [];
  trendingType: TrendingType = 'movie';
  isLoadingTrending = false;

  latestTrailersData: TrailerData[] = [];
  trailersCategory: TrailersCategory = 'popular';
  isLoadingTrailers = false;

  whatsPopular: Media[] = [];
  popularCategory: PopularCategory = 'streaming';
  isLoadingPopular = false;

  freeToWatch: Media[] = [];
  freeType: FreeType = 'movie';
  isLoadingFree = false;

  // Modal state
  showTrailerModal = false;
  selectedTrailerUrl: SafeResourceUrl | null = null;

  // ✅ Define option arrays for template
  readonly trailersOptions: TrailersCategory[] = [
    'popular',
    'streaming',
    'on_tv',
    'for_rent',
    'in_theaters',
  ];
  readonly popularOptions: PopularCategory[] = [
    'streaming',
    'on_tv',
    'for_rent',
    'in_theaters',
  ];

  constructor(
    private tmdb: TmdbService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ✅ Safe initialization
  private initializeData(): void {
    this.fetchTrending();
    this.fetchLatestTrailers();
    this.fetchWhatsPopular();
    this.fetchFreeToWatch();
  }

  // ✅ Safer trending fetch
  fetchTrending(): void {
    if (this.isLoadingTrending) return;

    this.isLoadingTrending = true;

    const serviceCall =
      this.trendingType === 'movie'
        ? this.tmdb.getTrendingMovies()
        : this.tmdb.getTrendingTvShows();

    serviceCall
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Failed to fetch trending:', error);
          return of({ results: [] });
        }),
        finalize(() => {
          this.isLoadingTrending = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((data) => {
        this.trendingItems = Array.isArray(data.results) ? data.results : [];
      });
  }

  // ✅ Much safer trailer fetching
  fetchLatestTrailers(): void {
    if (this.isLoadingTrailers) return;

    this.isLoadingTrailers = true;

    this.tmdb
      .getLatestTrailers(this.trailersCategory)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Failed to fetch latest trailers:', error);
          return of({ results: [] });
        }),
        finalize(() => {
          this.isLoadingTrailers = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((data) => {
        if (!data.results?.length) {
          this.latestTrailersData = [];
          return;
        }

        const mediaItems = data.results.slice(0, 15);
        this.fetchTrailersForMedia(mediaItems);
      });
  }

  // ✅ Safer batch trailer fetching
  private fetchTrailersForMedia(mediaItems: Media[]): void {
    const trailerRequests = mediaItems.map((media) => {
      const hasAirDate = Boolean(media.first_air_date);
      const serviceCall = hasAirDate
        ? this.tmdb.getTvTrailers(media.id)
        : this.tmdb.getMovieTrailers(media.id);

      return serviceCall.pipe(
        catchError((error) => {
          console.warn(
            `Failed to fetch trailers for media ${media.id}:`,
            error
          );
          return of({ results: [] });
        })
      );
    });

    forkJoin(trailerRequests)
      .pipe(takeUntil(this.destroy$))
      .subscribe((trailersResults) => {
        this.latestTrailersData = this.processTrailerResults(
          mediaItems,
          trailersResults
        );
        this.cdr.markForCheck();
      });
  }

  // ✅ Safe trailer processing
  private processTrailerResults(
    mediaItems: Media[],
    trailersResults: any[]
  ): TrailerData[] {
    return mediaItems
      .map((media, index) => {
        const trailerData = trailersResults[index];
        const results = trailerData?.results || [];

        const validTrailers = results
          .filter(
            (trailer: Trailer) =>
              trailer.site === 'YouTube' &&
              trailer.key &&
              ['Trailer', 'Teaser', 'Clip'].includes(trailer.type)
          )
          .slice(0, 1);

        return {
          media,
          trailers: validTrailers,
        };
      })
      .filter((item) => item.trailers.length > 0);
  }

  // ✅ Safer popular content fetch
  fetchWhatsPopular(): void {
    if (this.isLoadingPopular) return;

    this.isLoadingPopular = true;

    const serviceCall = this.getPopularServiceCall();

    serviceCall
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Failed to fetch popular content:', error);
          return of({ results: [] });
        }),
        finalize(() => {
          this.isLoadingPopular = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((data) => {
        const results = Array.isArray(data.results) ? data.results : [];
        this.whatsPopular = this.shuffleArray([...results]);
      });
  }

  // ✅ Safe service call selection
  private getPopularServiceCall() {
    switch (this.popularCategory) {
      case 'streaming':
        return this.tmdb.getTrendingMovies();
      case 'on_tv':
        return this.tmdb.getPopularTvShows();
      case 'for_rent':
        return this.tmdb.getTopRatedMovies();
      case 'in_theaters':
        return this.tmdb.getUpcomingMovies();
      default:
        return this.tmdb.getPopularMovies();
    }
  }

  // ✅ Safer free content fetch
  fetchFreeToWatch(): void {
    if (this.isLoadingFree) return;

    this.isLoadingFree = true;

    const serviceCall =
      this.freeType === 'movie'
        ? this.tmdb.getPopularMovies()
        : this.tmdb.getPopularTvShows();

    serviceCall
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Failed to fetch free content:', error);
          return of({ results: [] });
        }),
        finalize(() => {
          this.isLoadingFree = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((data) => {
        this.freeToWatch = Array.isArray(data.results) ? data.results : [];
      });
  }

  // ✅ Safe array shuffling
  private shuffleArray<T>(array: T[]): T[] {
    if (!Array.isArray(array) || array.length <= 1) return array;

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ✅ Safe setters with validation
  setTrendingType(type: TrendingType): void {
    if (type === this.trendingType) return;
    this.trendingType = type;
    this.fetchTrending();
  }

  setTrailersCategory(category: TrailersCategory): void {
    if (category === this.trailersCategory) return;
    this.trailersCategory = category;
    this.fetchLatestTrailers();
  }

  setPopularCategory(category: PopularCategory): void {
    if (category === this.popularCategory) return;
    this.popularCategory = category;
    this.fetchWhatsPopular();
  }

  setFreeType(type: FreeType): void {
    if (type === this.freeType) return;
    this.freeType = type;
    this.fetchFreeToWatch();
  }

  // ✅ Safe trailer modal handling
  onTrailerClick(event: { media: Media; trailer: Trailer }): void {
    if (!event?.media || !event?.trailer?.key) {
      console.warn('Invalid trailer click event:', event);
      return;
    }

    try {
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${encodeURIComponent(
          event.trailer.key
        )}?autoplay=1`
      );
      this.selectedTrailerUrl = safeUrl;
      this.showTrailerModal = true;
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to create trailer URL:', error);
    }
  }

  closeTrailerModal(): void {
    this.showTrailerModal = false;
    this.selectedTrailerUrl = null;
    this.cdr.markForCheck();
  }

  // ✅ Helper methods for template
  hasData(array: any[]): boolean {
    return Array.isArray(array) && array.length > 0;
  }

  getLoadingState(): boolean {
    return (
      this.isLoadingTrending ||
      this.isLoadingTrailers ||
      this.isLoadingPopular ||
      this.isLoadingFree
    );
  }

  // ✅ Label helper methods
  getTrailersCategoryLabel(category: TrailersCategory): string {
    const labels: Record<TrailersCategory, string> = {
      popular: 'Popular',
      streaming: 'Streaming',
      on_tv: 'On TV',
      for_rent: 'For Rent',
      in_theaters: 'In Theaters',
    };
    return labels[category];
  }

  getPopularCategoryLabel(category: PopularCategory): string {
    const labels: Record<PopularCategory, string> = {
      streaming: 'Streaming',
      on_tv: 'On TV',
      for_rent: 'For Rent',
      in_theaters: 'In Theaters',
    };
    return labels[category];
  }

  setTrendingTypeFromDropdown(type: TrendingType): void {
    if (type === this.trendingType) return;

    this.trendingType = type;
    this.fetchTrending();
    this.cdr.detectChanges(); // ✅ Force change detection
  }

  setTrailersCategoryFromDropdown(category: TrailersCategory): void {
    if (category === this.trailersCategory) return;

    this.trailersCategory = category;
    this.fetchLatestTrailers();
    this.cdr.detectChanges(); // ✅ Force change detection
  }

  setPopularCategoryFromDropdown(category: PopularCategory): void {
    if (category === this.popularCategory) return;

    this.popularCategory = category;
    this.fetchWhatsPopular();
    this.cdr.detectChanges(); // ✅ Force change detection
  }

  setFreeTypeFromDropdown(type: FreeType): void {
    if (type === this.freeType) return;

    this.freeType = type;
    this.fetchFreeToWatch();
    this.cdr.detectChanges(); // ✅ Force change detection
  }
}

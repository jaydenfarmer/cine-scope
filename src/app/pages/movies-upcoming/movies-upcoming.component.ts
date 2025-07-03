import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { MediaFilterComponent } from "../../components/media-filter/media-filter.component";
import { Observable, Subject } from 'rxjs';
import { Media, ApiResponse } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-movies-upcoming',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, MediaFilterComponent],
  templateUrl: './movies-upcoming.component.html',
  styleUrl: './movies-upcoming.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesUpcomingComponent extends BaseMediaList implements OnDestroy {
  private destroy$ = new Subject<void>();
  private currentFilters: any = null;

  constructor(
    private tmdb: TmdbService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  // ✅ Simplified fetchPage implementation
  fetchPage(page: number): Observable<ApiResponse<Media>> {
    if (this.currentFilters) {
      return this.tmdb.getFilteredMedia(this.currentFilters, page, 'movie', true); // true for upcoming
    }
    return this.tmdb.getUpcomingMovies(page);
  }

  // ✅ Simplified and safer filter handling
  onFilterChange(filters: any): void {
    this.currentFilters = filters;
    this.reset(); // ✅ Use BaseMediaList reset method
    
    // ✅ Let BaseMediaList handle the loading with fetchPage
    this.loadMore();
  }

  // ✅ Cleanup
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
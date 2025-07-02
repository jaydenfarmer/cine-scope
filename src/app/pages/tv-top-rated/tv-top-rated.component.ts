import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { MediaFilterComponent } from "../../components/media-filter/media-filter.component";
import { Observable, Subject, takeUntil } from 'rxjs';
import { Media, ApiResponse } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-tv-top-rated',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, MediaFilterComponent],
  templateUrl: './tv-top-rated.component.html',
  styleUrl: './tv-top-rated.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TvTopRatedComponent extends BaseMediaList implements OnDestroy {
  private destroy$ = new Subject<void>();
  private currentFilters: any = null;

  constructor(
    private tmdb: TmdbService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  fetchPage(page: number): Observable<ApiResponse<Media>> {
    // If we have filters, use filtered API, otherwise use top rated
    if (this.currentFilters) {
      return this.tmdb.getFilteredMedia(this.currentFilters, page, 'tv');
    }
    return this.tmdb.getTopRatedTvShows(page);
  }

  onFilterChange(filters: any) {
    this.currentFilters = filters;
    this.reset();
    this.loading = true;
    
    this.tmdb.getFilteredMedia(filters, 1, 'tv')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.filteredMedia = response.results || [];
          this.items = this.filteredMedia;
          this.allMedia = this.filteredMedia;
          this.noResults = this.filteredMedia.length === 0;
          this.loading = false;
          this.page = 2;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('TV Top Rated Filter error:', error);
          this.loading = false;
          this.noResults = true;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
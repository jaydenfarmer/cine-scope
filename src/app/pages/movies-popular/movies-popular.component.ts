import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { MediaFilterComponent } from "../../components/media-filter/media-filter.component";
import { Observable, Subject, takeUntil } from 'rxjs';
import { Media, ApiResponse } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-movies-popular',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, MediaFilterComponent],
  templateUrl: './movies-popular.component.html',
  styleUrl: './movies-popular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesPopularComponent extends BaseMediaList {
  private destroy$ = new Subject<void>();
  private currentFilters: any = null;

  constructor(
    private tmdb: TmdbService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  fetchPage(page: number): Observable<ApiResponse<Media>> {
    // If we have filters, use filtered API, otherwise use popular
    if (this.currentFilters) {
      return this.tmdb.getFilteredMedia(this.currentFilters, page, 'movie');
    }
    return this.tmdb.getPopularMovies(page);
  }

  onFilterChange(filters: any) {
  this.currentFilters = filters;
  this.reset();
  this.loading = true;
  
  this.tmdb.getFilteredMedia(filters, 1, 'movie')
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
        console.error('Filter error:', error);
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
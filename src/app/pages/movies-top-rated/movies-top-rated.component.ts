import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { MediaCardComponent } from '../../components/media-card/media-card.component';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { MediaFilterComponent } from "../../components/media-filter/media-filter.component";
import { Observable, Subject } from 'rxjs';
import { Media, ApiResponse } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-movies-top-rated',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, MediaFilterComponent],
  templateUrl: './movies-top-rated.component.html',
  styleUrl: './movies-top-rated.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesTopRatedComponent extends BaseMediaList implements OnDestroy {
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
      return this.tmdb.getFilteredMedia(this.currentFilters, page, 'movie');
    }
    return this.tmdb.getTopRatedMovies(page);
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
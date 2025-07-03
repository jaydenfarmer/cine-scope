import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { PeopleCardComponent } from "../../components/people-card/people-card.component";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Media, ApiResponse } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-people-popular',
  imports: [CommonModule, PeopleCardComponent],
  templateUrl: './people-popular.component.html',
  styleUrl: './people-popular.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeoplePopularComponent extends BaseMediaList {
  
  constructor(
    private tmdb: TmdbService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  // ✅ Add basic error handling but keep it simple
  fetchPage(page: number): Observable<ApiResponse<Media>> {
    return this.tmdb.getPopularPeople(page).pipe(
      catchError(error => {
        console.error('Failed to fetch popular people:', error);
        return of({ results: [], total_pages: 0, page: 1, total_results: 0 });
      })
    );
  }

  // ✅ Simple performance optimization
  trackByPersonId(index: number, person: any): number {
    return person?.id || index;
  }
}
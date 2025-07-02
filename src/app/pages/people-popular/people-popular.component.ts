import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { BaseMediaList } from '../base-media-list';
import { PeopleCardComponent } from "../../components/people-card/people-card.component";
import { Observable } from 'rxjs';
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

  fetchPage(page: number): Observable<ApiResponse<Media>> {
    return this.tmdb.getPopularPeople(page);
  }
}
import { Directive, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Media, ApiResponse } from '../shared/interfaces/media.interface';

@Directive()
export abstract class BaseMediaList implements OnInit {
  items: Media[] = [];
  allMedia: Media[] = [];
  filteredMedia: Media[] = [];
  page = 1;
  loading = false;
  showLoadMore = true;
  noResults = false;

  abstract fetchPage(page: number): Observable<ApiResponse<Media>>;

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    if (this.loading || !this.showLoadMore) return;
    
    this.loading = true;
    this.fetchPage(this.page).subscribe({
      next: (data: ApiResponse<Media>) => {
        const newItems = data.results || [];
        this.items = [...this.items, ...newItems];
        this.allMedia = [...this.items];
        this.filteredMedia = [...this.items];
        this.page++;
        
        this.showLoadMore = this.page <= data.total_pages && newItems.length > 0;
        this.noResults = this.items.length === 0;
        
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  trackByMediaId(index: number, item: Media): number {
    return item.id;
  }

  reset() {
    this.items = [];
    this.allMedia = [];
    this.filteredMedia = [];
    this.page = 1;
    this.loading = false;
    this.showLoadMore = true;
    this.noResults = false;
  }
}
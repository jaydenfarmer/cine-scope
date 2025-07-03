import { Directive, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Media, ApiResponse } from '../shared/interfaces/media.interface';

@Directive()
export abstract class BaseMediaList implements OnInit {
  items: Media[] = [];
  page = 1;
  loading = false;
  showLoadMore = true;
  noResults = false;
  error: string | null = null;  // ✅ Add error state

  abstract fetchPage(page: number): Observable<ApiResponse<Media>>;

  constructor(protected cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.loading || !this.showLoadMore) return;
    
    this.loading = true;
    this.error = null;  // ✅ Clear previous errors
    
    this.fetchPage(this.page).pipe(
      retry(1),  // ✅ Retry once on failure
      catchError(error => {
        console.error('Failed to load items:', error);
        this.error = 'Failed to load content. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        return EMPTY;  // ✅ Stop the stream
      })
    ).subscribe({
      next: (data: ApiResponse<Media>) => {
        const newItems = data?.results || [];
        
        // ✅ Simplified state management
        this.items = [...this.items, ...newItems];
        this.page++;
        
        // ✅ Smart pagination logic
        this.showLoadMore = this.hasMorePages(data, newItems);
        this.noResults = this.items.length === 0 && this.page === 2;  // ✅ Only no results on first load
        
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // ✅ Extract pagination logic
  private hasMorePages(data: ApiResponse<Media>, newItems: Media[]): boolean {
    return data?.total_pages ? 
           this.page <= data.total_pages && newItems.length > 0 : 
           newItems.length > 0;  // ✅ Fallback if no total_pages
  }

  // ✅ Retry functionality for error states
  retry(): void {
    this.error = null;
    this.loadMore();
  }

  // ✅ Improved reset with error clearing
  reset(): void {
    this.items = [];
    this.page = 1;
    this.loading = false;
    this.showLoadMore = true;
    this.noResults = false;
    this.error = null;
  }

  // ✅ Safe trackBy function
  trackByMediaId(index: number, item: Media): any {
    return item?.id || index;
  }

  // ✅ Utility methods for templates
  get hasItems(): boolean {
    return this.items.length > 0;
  }

  get hasError(): boolean {
    return !!this.error;
  }

  get showEmptyState(): boolean {
    return this.noResults && !this.loading && !this.hasError;
  }
}
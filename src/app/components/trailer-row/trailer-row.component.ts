import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerCardComponent } from '../trailer-card/trailer-card.component';
import { Media, Trailer } from '../../shared/interfaces/media.interface';

// ✅ Better type definition
interface TrailerData {
  media: Media;
  trailers: Trailer[];
}

@Component({
  selector: 'app-trailer-row',
  standalone: true,
  imports: [CommonModule, TrailerCardComponent],
  templateUrl: './trailer-row.component.html',
  styleUrls: ['./trailer-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Performance optimization
})
export class TrailerRowComponent {
  @Input() trailerData: TrailerData[] = []; // ✅ Proper typing with default
  @Output() trailerClick = new EventEmitter<{media: Media, trailer: Trailer}>();

  // ✅ Safe event handler with validation
  onTrailerClick(event: {media: Media, trailer: Trailer}): void {
    if (!event?.media || !event?.trailer) {
      console.warn('Invalid trailer click event:', event);
      return;
    }
    
    this.trailerClick.emit(event);
  }

  // ✅ Safe method to check if data exists
  hasTrailerData(): boolean {
    return Array.isArray(this.trailerData) && this.trailerData.length > 0;
  }

  // ✅ Safe method to get trailer count for debugging
  getTotalTrailerCount(): number {
    if (!this.hasTrailerData()) return 0;
    
    return this.trailerData.reduce((total, item) => {
      return total + (Array.isArray(item.trailers) ? item.trailers.length : 0);
    }, 0);
  }

  // ✅ Track by function for performance
  trackByMedia(index: number, item: TrailerData): any {
    return item.media?.id || index;
  }

  // ✅ Track by function for trailers
  trackByTrailer(index: number, trailer: Trailer): any {
    return trailer.key || trailer.id || index;
  }
}
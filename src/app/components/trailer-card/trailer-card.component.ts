import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { API_CONFIG } from '../../shared/constants/api.constants';
import { Media, Trailer } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-trailer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trailer-card.component.html',
  styleUrls: ['./trailer-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrailerCardComponent {
  @Input() media!: Media;
  @Input() trailer!: Trailer;
  @Output() trailerClick = new EventEmitter<{media: Media, trailer: Trailer}>();

  showFallback = false;

  constructor(private router: Router) {}

  // ✅ Safe method to get media title
  getMediaTitle(): string {
    if (!this.media) return 'Unknown Title';
    return this.media.title || this.media.name || 'Unknown Title';
  }

  // ✅ Safe method to get trailer name
  getTrailerName(): string {
    if (!this.trailer) return 'Trailer';
    return this.trailer.name || 'Trailer';
  }

  // ✅ Safe method to get alt text
  getTrailerAlt(): string {
    return `${this.getMediaTitle()} - ${this.getTrailerName()}`;
  }

  // ✅ Safe method for default message
  getDefaultMessage(): string {
    return this.trailer?.key ? 'Thumbnail Unavailable' : 'No Trailer Available';
  }

  // ✅ Safe thumbnail URL generation
  getThumbnailUrl(key: string): string {
    if (!key || typeof key !== 'string') {
      this.showFallback = true;
      return '';
    }
    return `${API_CONFIG.YOUTUBE_THUMBNAIL_URL}/${encodeURIComponent(key)}/hqdefault.jpg`;
  }

  // ✅ Safe click handlers
  onTrailerClick(): void {
    if (!this.media || !this.trailer) return;
    this.trailerClick.emit({media: this.media, trailer: this.trailer});
  }

  onMediaClick(): void {
    if (!this.media?.id) return;
    
    const mediaType = this.determineMediaType();
    this.router.navigate([`/${mediaType}/${this.media.id}`]);
  }

  // ✅ Safer media type detection
  private determineMediaType(): string {
    if (!this.media) return 'movie';
    
    if (this.media.media_type) {
      return this.media.media_type;
    }
    
    // Check for TV-specific properties
    if (this.media.first_air_date || this.media.name) {
      return 'tv';
    }
    
    return 'movie';
  }

  // ✅ Safe error handling
  onImageError(event: Event): void {
    this.showFallback = true;
  }
}
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

  onTrailerClick() {
    this.trailerClick.emit({media: this.media, trailer: this.trailer});
  }

  onMediaClick() {
    const mediaType = this.media.media_type || (this.media.first_air_date ? 'tv' : 'movie');
    const mediaId = this.media.id;
    
    this.router.navigate([`/${mediaType}/${mediaId}`]);
  }

  getThumbnailUrl(key: string): string {
    return `${API_CONFIG.YOUTUBE_THUMBNAIL_URL}/${key}/hqdefault.jpg`;
  }

  onImageError(event: any) {
    this.showFallback = true;
  }
}
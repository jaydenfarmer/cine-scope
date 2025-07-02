import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class SearchCardComponent {
  @Input() media: any;
  @Input() mediaType: 'movie' | 'tv' | 'person' = 'movie';

  getTitle(): string {
    if (this.mediaType === 'person') {
      return this.media.name || 'Unknown Person';
    }
    return this.media.title || this.media.name || 'Unknown Title';
  }

  getDate(): string {
    if (this.mediaType === 'person') {
      return '';
    }
    return this.media.release_date || this.media.first_air_date;
  }

  getImageUrl(): string {
    if (this.mediaType === 'person') {
      return this.media.profile_path 
        ? `https://image.tmdb.org/t/p/w342${this.media.profile_path}`
        : 'assets/default-person.png';
    }
    return this.media.poster_path 
      ? `https://image.tmdb.org/t/p/w342${this.media.poster_path}`
      : 'assets/default-poster.png';
  }

  getKnownForText(): string {
    if (!this.media?.known_for || this.media.known_for.length === 0) {
      return '';
    }
    return this.media.known_for.map((item: any) => item.title || item.name).join(', ');
  }
}
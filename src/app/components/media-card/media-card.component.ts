import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaCardComponent {
  @Input() media: any;  // Keep as any for now to match your current usage

  // ✅ Keep your exact rating color logic
  getRatingColor(vote: number): string {
    if (vote >= 7) return 'rating-green';
    if (vote < 3) return 'rating-red';
    return 'rating-yellow';
  }

  // ✅ Safe image URL generation
  getImageUrl(): string {
    if (this.media?.poster_path) {
      return `https://image.tmdb.org/t/p/w300${this.media.poster_path}`;
    }
    return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  }

  // ✅ Safe router link generation
  getRouterLink(): string[] {
    if (!this.media?.id) return ['/'];
    
    // ✅ Simplified: only movie or TV
    if (this.media.media_type === 'tv' || this.media.name) {
      return ['/tv', this.media.id.toString()];
    }
    
    return ['/movie', this.media.id.toString()];
  }

  // ✅ Safe title display
  getTitle(): string {
    return this.media?.title || this.media?.name || 'Untitled';
  }

  // ✅ Safe date display
  getDate(): string | null {
    return this.media?.release_date || this.media?.first_air_date || null;
  }

  // ✅ Safe rating check
  hasRating(): boolean {
    return this.media?.vote_average !== undefined && 
           this.media?.vote_average !== null;
  }

  // ✅ Safe rating display
  getRating(): string {
    if (!this.hasRating()) return 'NR';
    return this.media.vote_average === 0 ? 'NR' : this.media.vote_average.toFixed(1);
  }

  // ✅ Safe rating percentage for CSS
  getRatingPercentage(): string {
    if (!this.hasRating()) return '0%';
    return `${this.media.vote_average * 10}%`;
  }
}
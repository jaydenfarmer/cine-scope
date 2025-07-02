import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class HomeCardComponent {
  @Input() media: any;
  @Input() mediaType: 'movie' | 'tv' = 'movie';

  getRatingColor(vote: number): string {
    if (vote >= 7) return 'rating-green';
    if (vote < 3) return 'rating-red';
    return 'rating-yellow';
  }
}
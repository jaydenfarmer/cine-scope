import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-media-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.scss'
})
export class MediaCardComponent {
  @Input() media: any;

  getRatingColor(vote: number): string {
    if (vote >= 7) return 'rating-green';
    if (vote < 3) return 'rating-red';
    return 'rating-yellow';
  }
}
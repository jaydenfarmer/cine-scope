import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrailerCardComponent } from '../trailer-card/trailer-card.component';

@Component({
  selector: 'app-trailer-row',
  standalone: true,
  imports: [CommonModule, TrailerCardComponent],
  templateUrl: './trailer-row.component.html',
  styleUrls: ['./trailer-row.component.scss']
})
export class TrailerRowComponent {
  @Input() trailerData: {media: any, trailers: any[]}[] = [];
  @Output() trailerClick = new EventEmitter<{media: any, trailer: any}>();

  onTrailerClick(event: {media: any, trailer: any}) {
    this.trailerClick.emit(event);
  }
}
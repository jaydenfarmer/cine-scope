import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HomeCardComponent } from '../home-card/home-card.component';


@Component({
  selector: 'app-media-row',
  imports: [CommonModule, HomeCardComponent],
  standalone: true,
  templateUrl: './media-row.component.html',
  styleUrl: './media-row.component.scss'
})
export class MediaRowComponent {
  @Input() items: any[] = [];
  @Input() title: string = '';
  @Input() mediaType: 'movie' | 'tv' = 'movie';
}

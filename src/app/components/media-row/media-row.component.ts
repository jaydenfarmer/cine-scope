import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HomeCardComponent } from '../home-card/home-card.component';
import { Media } from '../../shared/interfaces/media.interface';

@Component({
  selector: 'app-media-row',
  imports: [CommonModule, HomeCardComponent],
  standalone: true,
  templateUrl: './media-row.component.html',
  styleUrl: './media-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // ✅ Performance
})
export class MediaRowComponent {
  @Input() items: Media[] = [];                    // ✅ Proper typing
  @Input() title: string = '';                     
  @Input() mediaType: 'movie' | 'tv' = 'movie';   
  @Input() isLoading: boolean = false;             // ✅ Loading state
  @Input() emptyMessage: string = 'No items available'; // ✅ Empty state

  // ✅ Helper methods
  hasItems(): boolean {
    return Array.isArray(this.items) && this.items.length > 0;
  }

  // ✅ Track by for performance
  trackByItem(index: number, item: Media): any {
    return item.id || index;
  }
}
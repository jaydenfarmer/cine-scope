import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-people-card',
  templateUrl: './people-card.component.html',
  styleUrls: ['./people-card.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleCardComponent {
  @Input() person: any;

  // ✅ Safe router link generation
  getRouterLink(): string[] {
    return this.person?.id ? ['/person', this.person.id.toString()] : ['/'];
  }

  // ✅ Safe image URL generation
  getImageUrl(): string {
    if (this.person?.profile_path) {
      return `https://image.tmdb.org/t/p/w342${this.person.profile_path}`;
    }
    return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
  }

  // ✅ Safe name display
  getPersonName(): string {
    return this.person?.name || 'Unknown Person';
  }

  // ✅ Improved known for text with safety
  getKnownForText(): string {
    if (!this.person?.known_for || !Array.isArray(this.person.known_for) || this.person.known_for.length === 0) {
      return '';
    }
    
    return this.person.known_for
      .map((item: any) => item?.title || item?.name)
      .filter(Boolean)  // ✅ Remove empty values
      .slice(0, 3)      // ✅ Limit to 3 items for better UI
      .join(', ');
  }

  // ✅ Check if person has image
  hasImage(): boolean {
    return !!this.person?.profile_path;
  }

  // ✅ Check if person has known for data
  hasKnownFor(): boolean {
    return this.person?.known_for && 
           Array.isArray(this.person.known_for) && 
           this.person.known_for.length > 0;
  }
}
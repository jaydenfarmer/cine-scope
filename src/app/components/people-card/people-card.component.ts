import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-people-card',
  templateUrl: './people-card.component.html',
  styleUrls: ['./people-card.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class PeopleCardComponent {
  @Input() person: any;

  getKnownForText(): string {
    if (!this.person?.known_for || this.person.known_for.length === 0) {
      return '';
    }
    return this.person.known_for.map((item: any) => item.title || item.name).join(', ');
  }
}
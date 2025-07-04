import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-known-for-row',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './known-for-row.component.html',
  styleUrl: './known-for-row.component.scss'
})
export class KnownForRowComponent {
  @Input() items: any[] = [];

  ngOnInit() {
    // ✅ Sort by combination of recency and popularity
    this.items = this.items.sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || '1900-01-01');
      const dateB = new Date(b.release_date || b.first_air_date || '1900-01-01');
      const popularityA = a.popularity || 0;
      const popularityB = b.popularity || 0;
      
      // Weight: 70% recency, 30% popularity
      const scoreA = (dateA.getTime() * 0.7) + (popularityA * 0.3);
      const scoreB = (dateB.getTime() * 0.7) + (popularityB * 0.3);
      
      return scoreB - scoreA;
    });
  }
}
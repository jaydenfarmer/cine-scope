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
}
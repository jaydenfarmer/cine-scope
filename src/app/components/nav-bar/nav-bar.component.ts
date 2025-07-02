import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {
  // ✅ Keep your exact state variables
  menuOpen = false;
  searchExpanded = false;
  query = '';

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    public themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ✅ Safe mobile detection
  get isMobile(): boolean {
    return isPlatformBrowser(this.platformId) ? window.innerWidth <= 700 : false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobile) {
      this.menuOpen = false;
      this.searchExpanded = false;
    }
  }

  // ✅ Keep your exact search expansion logic, just safer
  expandSearch(event: Event): void {
    event.preventDefault();
    this.searchExpanded = true;
    
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 0);
  }

  // ✅ Keep your exact navigation logic
  goHome(): void {
    this.router.navigate(['/']);
    this.menuOpen = false;
  }

  navigateTo(path: string): void {
    this.router.navigate(['/' + path]);
    this.menuOpen = false;
    
    if (isPlatformBrowser(this.platformId) && document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
  }

  // ✅ Keep your exact search logic, just add safety
  onSubmit(event: Event): void {
    event.preventDefault();
    const trimmed = this.query.trim();
    
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { search: trimmed } });
    } else {
      this.menuOpen = false;
    }
    
    this.menuOpen = false;
    this.searchExpanded = false;
  }
}
import { Component, EventEmitter, Output, AfterViewInit, ChangeDetectorRef, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements AfterViewInit, OnInit {
  menuOpen = false;
  searchExpanded = false;
  query: string = '';

  @Output() search = new EventEmitter<string>();

  constructor(
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  get isMobile(): boolean {
    return window.innerWidth <= 700;
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.isMobile) {
      this.menuOpen = false;
      this.searchExpanded = false;
    }
  }

  expandSearch(event: Event) {
    event.preventDefault();
    this.searchExpanded = true;
    setTimeout(() => {
      const input = document.querySelector('.search-bar input') as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  }

  goHome() {
    this.router.navigate(['/']);
    this.menuOpen = false;
  }

  navigateTo(path: string) {
    this.router.navigate(['/' + path]);
    this.menuOpen = false; //
    document.activeElement && (document.activeElement as HTMLElement).blur();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const trimmed = this.query.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { search: trimmed } });
    } else {
      this.router.navigate(['/']);
    }
    this.menuOpen = false;
    this.searchExpanded = false;
  }
}
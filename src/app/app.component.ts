import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  currentUrl = '';
  title = 'movie-match';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }

  showMediaFilter() {
    // Hide on home
    if (this.currentUrl === '/') return false;

    // Hide on people popular and person detail
    if (this.currentUrl.startsWith('/people/popular') || this.currentUrl.startsWith('/person/')) return false;

    // Hide on TV or Movie detail pages (e.g., /tv/12345 or /movie/6789)
    if (/^\/tv\/\d+/.test(this.currentUrl) || /^\/movie\/\d+/.test(this.currentUrl)) return false;

    // Show on all other pages (including /tv/airing-today, /movie/popular, etc.)
    return true;
  }

  routeTitles: { [key: string]: string } = {
    '/movies/popular': 'Popular Movies',
    '/movies/top-rated': 'Top Rated Movies',
    '/movies/upcoming': 'Upcoming Movies',
    '/tv/popular': 'Popular TV Shows',
    '/tv/top-rated': 'Top Rated TV Shows',
    '/tv/airing-today': 'Airing Today',
    '/people/popular': 'Popular People'
  };

  get pageTitle(): string | null {
    return this.routeTitles[this.currentUrl] || null;
  }
}
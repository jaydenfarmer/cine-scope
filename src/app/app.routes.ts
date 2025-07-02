import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MediaDetailsComponent } from './pages/media-details/media-details.component';
import { SearchComponent } from './pages/search/search.component';
import { MoviesPopularComponent } from './pages/movies-popular/movies-popular.component';
import { MoviesTopRatedComponent } from './pages/movies-top-rated/movies-top-rated.component';
import { MoviesUpcomingComponent } from './pages/movies-upcoming/movies-upcoming.component';
import { TvPopularComponent } from './pages/tv-popular/tv-popular.component';
import { TvTopRatedComponent } from './pages/tv-top-rated/tv-top-rated.component';
import { TvAiringTodayComponent } from './pages/tv-airing-today/tv-airing-today.component';
import { PeoplePopularComponent } from './pages/people-popular/people-popular.component';
import { PeopleDetailsComponent } from './pages/people-details/people-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MediaDetailsComponent },
  { path: 'tv/popular', component: TvPopularComponent },
  { path: 'tv/top-rated', component: TvTopRatedComponent },
  { path: 'tv/airing-today', component: TvAiringTodayComponent },
  { path: 'tv/:id', component: MediaDetailsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'movies/popular', component: MoviesPopularComponent },
  { path: 'movies/top-rated', component: MoviesTopRatedComponent },
  { path: 'movies/upcoming', component: MoviesUpcomingComponent },
  { path: 'people/popular', component: PeoplePopularComponent },
  { path: 'person/:id', component: PeopleDetailsComponent },
];
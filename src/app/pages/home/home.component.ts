import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../services/tmdb.service';
import { MediaRowComponent } from '../../components/media-row/media-row.component';
import { TrailerRowComponent } from '../../components/trailer-row/trailer-row.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaRowComponent, TrailerRowComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Trending
  trendingItems: any[] = [];
  trendingType: 'movie' | 'tv' = 'movie';

  // Latest Trailers with multiple options
  latestTrailersData: {media: any, trailers: any[]}[] = [];
  trailersCategory: 'popular' | 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters' = 'popular';

  // What's Popular with multiple options (with randomness)
  whatsPopular: any[] = [];
  popularCategory: 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters' = 'streaming';

  // Free to Watch (movies/tv only) (with randomness)
  freeToWatch: any[] = [];
  freeType: 'movie' | 'tv' = 'movie';
  
  // Trailer modal
  showTrailerModal = false;
  selectedTrailerUrl: SafeResourceUrl | null = null;

  constructor(
    private tmdb: TmdbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchTrending();
    this.fetchLatestTrailers();
    this.fetchWhatsPopular();
    this.fetchFreeToWatch();
  }

  fetchTrending() {
    if (this.trendingType === 'movie') {
      this.tmdb.getTrendingMovies().subscribe(data => {
        this.trendingItems = data.results;
      });
    } else {
      this.tmdb.getTrendingTvShows().subscribe(data => {
        this.trendingItems = data.results;
      });
    }
  }
  setTrendingType(type: 'movie' | 'tv') {
    this.trendingType = type;
    this.fetchTrending();
  }
  fetchLatestTrailers() {
    this.tmdb.getLatestTrailers(this.trailersCategory).subscribe((data: any) => {
      const mediaItems = data.results.slice(0, 40);
      
      const trailerRequests = mediaItems.map((media: any) => {
        if (this.trailersCategory === 'on_tv' || media.first_air_date) {
          return this.tmdb.getTvTrailers(media.id);
        } else {
          return this.tmdb.getMovieTrailers(media.id);
        }
      });

      forkJoin(trailerRequests).subscribe((trailersResults) => {
        const results = trailersResults as any[];
        this.latestTrailersData = mediaItems
          .map((media: any, index: number) => ({
            media,
            trailers: results[index].results.filter(
              (t: any) => t.site === 'YouTube' && 
              ['Trailer', 'Teaser', 'Clip'].includes(t.type)
            ).slice(0, 1)
          }))
          .filter((item: {media: any, trailers: any[]}) => item.trailers.length > 0);
      });
    });
  }
  setTrailersCategory(category: 'popular' | 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters') {
    this.trailersCategory = category;
    this.fetchLatestTrailers();
  }

  fetchWhatsPopular() {
    let serviceCall;
    
    switch(this.popularCategory) {
      case 'streaming':
        serviceCall = this.tmdb.getTrendingMovies();
        break;
      case 'on_tv':
        serviceCall = this.tmdb.getPopularTvShows();
        break;
      case 'for_rent':
        serviceCall = this.tmdb.getTopRatedMovies();
        break;
      case 'in_theaters':
        serviceCall = this.tmdb.getUpcomingMovies();
        break;
      default:
        serviceCall = this.tmdb.getPopularMovies();
    }
    
    serviceCall.subscribe(data => {
      const shuffled = [...data.results].sort(() => 0.5 - Math.random());
      this.whatsPopular = shuffled;
    });
  }

  setPopularCategory(category: 'streaming' | 'on_tv' | 'for_rent' | 'in_theaters') {
    this.popularCategory = category;
    this.fetchWhatsPopular();
  }

  fetchFreeToWatch() {
    const serviceCall = this.freeType === 'movie' ? 
      this.tmdb.getTopRatedMovies() : 
      this.tmdb.getTopRatedTvShows();
      
    serviceCall.subscribe(data => {
      const shuffled = [...data.results].sort(() => 0.5 - Math.random());
      this.freeToWatch = shuffled;
    });
  }

  setFreeType(type: 'movie' | 'tv') {
    this.freeType = type;
    this.fetchFreeToWatch();
  }

  onTrailerClick(event: {media: any, trailer: any}) {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${event.trailer.key}?autoplay=1`
    );
    this.selectedTrailerUrl = safeUrl;
    this.showTrailerModal = true;
  }

  closeTrailerModal() {
    this.showTrailerModal = false;
    this.selectedTrailerUrl = null;
  }
}
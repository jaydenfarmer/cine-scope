import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterModule, UrlSegment } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-media-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.scss'
})
export class MediaDetailsComponent implements OnInit {
  // Observables for async pipe
  media$!: Observable<any>;
  trailers$!: Observable<any[]>;
  cast$!: Observable<any[]>;
  youtubeTrailers$!: Observable<any[]>;
  
  // Component state for modal and other features
  trendingMovies: any[] = [];
  showTrailerModal = false;
  selectedTrailerUrl: SafeResourceUrl | null = null;

  @ViewChild('trailersSection') trailersSection!: ElementRef<HTMLDivElement>;

  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Get type and id from route
    const routeData$ = this.route.url.pipe(
      map(segments => ({
        type: segments[0]?.path as 'movie' | 'tv',
        id: Number(this.route.snapshot.paramMap.get('id'))
      }))
    );

    // Create observables for each data type
    this.media$ = routeData$.pipe(
      switchMap(({ type, id }) => 
        type === 'tv' ? this.tmdb.getTvDetails(id) : this.tmdb.getMovieDetails(id)
      )
    );

    this.trailers$ = routeData$.pipe(
      switchMap(({ type, id }) => 
        type === 'tv' ? this.tmdb.getTvTrailers(id) : this.tmdb.getMovieTrailers(id)
      ),
      map(data => data.results)
    );

    this.cast$ = routeData$.pipe(
      switchMap(({ type, id }) => 
        type === 'tv' ? this.tmdb.getTvCredits(id) : this.tmdb.getMovieCredits(id)
      ),
      map(data => data.cast)
    );

    // Derived observable for YouTube trailers
    this.youtubeTrailers$ = this.trailers$.pipe(
      map(trailers => trailers.filter(t => t.site === 'YouTube' && t.type === 'Trailer'))
    );
  }

  getSafeUrl(key: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + key);
  }

  openTrailerModal() {
    // This method would need to subscribe to get the first trailer
    // Since we're using async pipe, this is less needed now
    this.youtubeTrailers$.subscribe(trailers => {
      const firstTrailer = trailers[0];
      if (firstTrailer) {
        this.selectedTrailerUrl = this.getSafeUrl(firstTrailer.key);
        this.showTrailerModal = true;
      }
    });
  }

  openSelectedTrailerModal(trailerKey: string) {
    this.selectedTrailerUrl = this.getSafeUrl(trailerKey);
    this.showTrailerModal = true;
  }

  closeTrailerModal() {
    this.showTrailerModal = false;
    this.selectedTrailerUrl = null;
  }
}
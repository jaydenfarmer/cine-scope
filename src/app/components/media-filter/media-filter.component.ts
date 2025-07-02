import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-media-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './media-filter.component.html',
  styleUrl: './media-filter.component.scss'
})
export class MediaFilterComponent implements OnInit, OnChanges {

  @Output() filterChange = new EventEmitter<any>();
  @Input() mediaType: 'movie' | 'tv' = 'movie';

  sortField: string = 'popularity.desc';
  sortDirection = 'desc';
  sortOpen = false;
  providers: any[] = [];
  selectedProvider: string = '';
  providersOpen = false;
  filtersOpen = false;
  showMe = 'everything';
  allAvailabilities = true;
  allReleases = true;
  allCountries = true;
  releaseFrom: string = '';
  defaultReleaseTo = new Date().toISOString().slice(0, 10);
  releaseTo = this.defaultReleaseTo;
  releaseTypes = {
    limited: true,
    theatrical: true,
    premiere: true,
    digital: true,
    physical: true,
    tv: true
  };

  movieGenres = [
    { id: 28, name: 'Action', selected: false },
    { id: 12, name: 'Adventure', selected: false },
    { id: 16, name: 'Animation', selected: false },
    { id: 35, name: 'Comedy', selected: false },
    { id: 80, name: 'Crime', selected: false },
    { id: 99, name: 'Documentary', selected: false },
    { id: 18, name: 'Drama', selected: false },
    { id: 10751, name: 'Family', selected: false },
    { id: 14, name: 'Fantasy', selected: false },
    { id: 36, name: 'History', selected: false },
    { id: 27, name: 'Horror', selected: false },
    { id: 10402, name: 'Music', selected: false },
    { id: 9648, name: 'Mystery', selected: false },
    { id: 10749, name: 'Romance', selected: false },
    { id: 878, name: 'Science Fiction', selected: false },
    { id: 10770, name: 'TV Movie', selected: false },
    { id: 53, name: 'Thriller', selected: false },
    { id: 10752, name: 'War', selected: false },
    { id: 37, name: 'Western', selected: false }
  ];

  tvGenres = [
    { id: 10759, name: 'Action & Adventure', selected: false },
    { id: 16, name: 'Animation', selected: false },
    { id: 35, name: 'Comedy', selected: false },
    { id: 80, name: 'Crime', selected: false },
    { id: 99, name: 'Documentary', selected: false },
    { id: 18, name: 'Drama', selected: false },
    { id: 10751, name: 'Family', selected: false },
    { id: 10762, name: 'Kids', selected: false },
    { id: 9648, name: 'Mystery', selected: false },
    { id: 10763, name: 'News', selected: false },
    { id: 10764, name: 'Reality', selected: false },
    { id: 10765, name: 'Sci-Fi & Fantasy', selected: false },
    { id: 10766, name: 'Soap', selected: false },
    { id: 10767, name: 'Talk', selected: false },
    { id: 10768, name: 'War & Politics', selected: false },
    { id: 37, name: 'Western', selected: false }
  ];

  get genres() {
    return this.mediaType === 'movie' ? this.movieGenres : this.tvGenres;
  }

  movieCertifications = [
    { id: 'NR', name: 'NR', selected: false },
    { id: 'G', name: 'G', selected: false },
    { id: 'PG', name: 'PG', selected: false },
    { id: 'PG-13', name: 'PG-13', selected: false },
    { id: 'R', name: 'R', selected: false },
    { id: 'NC-17', name: 'NC-17', selected: false }
  ];

  tvCertifications = [
    { id: 'NR', name: 'NR', selected: false },
    { id: 'TV-Y', name: 'TV-Y', selected: false },
    { id: 'TV-Y7', name: 'TV-Y7', selected: false },
    { id: 'TV-G', name: 'TV-G', selected: false },
    { id: 'TV-PG', name: 'TV-PG', selected: false },
    { id: 'TV-14', name: 'TV-14', selected: false },
    { id: 'TV-MA', name: 'TV-MA', selected: false }
  ];

  get certifications() {
    return this.mediaType === 'movie' ? this.movieCertifications : this.tvCertifications;
  }

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ];

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' }
  ];

  selectedCountry = '';
  language = '';
  userScore = 0;
  minVotes = 0;
  runtime = 0;
  keywords = '';
  selectedProviders: number[] = [];
  selectedGenres: number[] = []; // Changed from string[] to number[]
  selectedCertifications: string[] = []; // Certifications remain strings
  lastSubmittedFilters: any = null;

  hasActiveFilters(): boolean {
    if (this.selectedGenres.length > 0) return true;
    if (this.selectedCertifications.length > 0) return true;
    if (this.selectedProviders && this.selectedProviders.length > 0) return true;
    if (this.sortField !== 'popularity.desc' || this.sortDirection !== 'desc') return true;
    if (this.language) return true;
    if (this.userScore > 0) return true;
    if (this.minVotes > 0) return true;
    if (this.runtime > 0) return true;
    if (this.showMe !== 'everything') return true;
    if (!this.allAvailabilities) return true;
    if (!this.allReleases) return true;
    if (!this.allCountries) return true;
    if (this.releaseFrom) return true;
    if (this.releaseTo && this.releaseTo !== this.defaultReleaseTo) return true;
    if (this.keywords && this.keywords.trim() !== '') return true;
    return false;
  }

  filtersChanged(): boolean {
    return JSON.stringify(this.getCurrentFilters()) !== JSON.stringify(this.lastSubmittedFilters);
  }

  getCurrentFilters() {
    return {
      genres: this.selectedGenres,
      certifications: this.selectedCertifications,
      providers: this.selectedProviders,
      sortField: this.sortField,
      sortDirection: this.sortDirection,
      language: this.language,
      userScore: this.userScore,
      minVotes: this.minVotes,
      runtime: this.runtime,
      showMe: this.showMe,
      allAvailabilities: this.allAvailabilities,
      allReleases: this.allReleases,
      allCountries: this.allCountries,
      selectedCountry: this.selectedCountry,
      releaseTypes: this.releaseTypes,
      releaseFrom: this.releaseFrom,
      releaseTo: this.releaseTo,
      keywords: this.keywords
    };
  }

  constructor(private tmdb: TmdbService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.tmdb.getMovieProviders().subscribe(res => {
      this.lastSubmittedFilters = JSON.parse(JSON.stringify(this.getCurrentFilters()));
      this.providers = res.results.filter((p: any) => !!p.logo_path);
      this.cdr.detectChanges();
    });
  }

  ngOnChanges() {
  this.selectedGenres = [];
  this.selectedCertifications = [];
  
  // Reset all genre selections
  this.movieGenres.forEach(genre => genre.selected = false);
  this.tvGenres.forEach(genre => genre.selected = false);
  this.movieCertifications.forEach(cert => cert.selected = false);
  this.tvCertifications.forEach(cert => cert.selected = false);
}

  toggleProvider(providerId: number) {
    const idx = this.selectedProviders.indexOf(providerId);
    if (idx > -1) {
      this.selectedProviders.splice(idx, 1);
    } else {
      this.selectedProviders.push(providerId);
    }
  }

  toggleSort() {
    this.sortOpen = !this.sortOpen;
  }

  onSortFieldChange(event: any) {
    if (this.sortField === 'a-z') this.sortDirection = 'asc';
    if (this.sortField === 'z-a') this.sortDirection = 'desc';
  }

  showDirectionDropdown() {
    return ['popularity', 'rating', 'release_date'].includes(this.sortField);
  }

  trackByGenre(index: number, genre: any) {
    return genre.id; // Changed from genre.name to genre.id
  }

  trackByCert(index: number, cert: any) {
    return cert.id; // Changed from cert.name to cert.id
  }
  
  toggleGenre(genreId: number) {
  const idx = this.selectedGenres.indexOf(genreId);
  if (idx > -1) {
    this.selectedGenres.splice(idx, 1);
  } else {
    this.selectedGenres.push(genreId);
  }
  
  // Make sure to update the selected property
  const currentGenres = this.mediaType === 'movie' ? this.movieGenres : this.tvGenres;
  const genre = currentGenres.find(g => g.id === genreId);
  if (genre) {
    genre.selected = idx === -1; // Set to true if we just added it, false if we removed it
  }
}

  toggleCertification(certId: string) { // Changed parameter from certName to certId
    const idx = this.selectedCertifications.indexOf(certId);
    if (idx > -1) {
      this.selectedCertifications.splice(idx, 1);
    } else {
      this.selectedCertifications.push(certId);
    }
    
    const currentCertifications = this.mediaType === 'movie' ? this.movieCertifications : this.tvCertifications;
    const certification = currentCertifications.find(c => c.id === certId); // Changed from c.name === certName
    if (certification) {
      certification.selected = !certification.selected;
    }
  }

  onSearch() {
    const filters = this.getCurrentFilters();
    this.lastSubmittedFilters = JSON.parse(JSON.stringify(filters));
    this.filterChange.emit(filters);
  }
}
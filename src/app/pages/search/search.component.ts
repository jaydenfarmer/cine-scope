import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from "../../components/media-card/media-card.component";
import { PeopleCardComponent } from "../../components/people-card/people-card.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, PeopleCardComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string | null = null;
  selectedCategory: string = 'movies';

  searchMovies: any[] = [];
  searchTvShows: any[] = [];
  searchPeople: any[] = [];

  totalMovieResults: number = 0;
  totalTvResults: number = 0;
  totalPeopleResults: number = 0;

  constructor(private tmdb: TmdbService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      this.searchQuery = search || null;
      if (search) {
        this.tmdb.searchMovies(search).subscribe(data => {
          this.searchMovies = data.results;
          this.totalMovieResults = data.total_results; // Capture total count
        });
        this.tmdb.searchTvShows(search).subscribe(data => {
          this.searchTvShows = data.results;
          this.totalTvResults = data.total_results; // Capture total count
        });
        this.tmdb.searchPeople(search).subscribe(data => {
          this.searchPeople = data.results;
          this.totalPeopleResults = data.total_results; // Capture total count
        });
      } else {
        this.searchMovies = [];
        this.searchTvShows = [];
        this.searchPeople = [];
      }
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { KnownForRowComponent } from '../../components/known-for-row/known-for-row.component';
import { Observable, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [CommonModule, KnownForRowComponent],
  templateUrl: './people-details.component.html',
  styleUrl: './people-details.component.scss'
})
export class PeopleDetailsComponent implements OnInit {
  
  // Observables for async pipe
  person$!: Observable<any>;
  knownFor$!: Observable<any[]>;
  
  // Component state (still needs to be a property for modal state)
  bioExpanded = false;

  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    // Get person ID from route
    const personId$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id')))
    );

    // Create observables for person data
    this.person$ = personId$.pipe(
      switchMap(id => this.tmdb.getPersonDetails(id))
    );

    this.knownFor$ = personId$.pipe(
      switchMap(id => this.tmdb.getPersonCombinedCredits(id)),
      map(data => (data.cast || []).slice(0, 10))
    );
  }
  
  toggleBio() {
    this.bioExpanded = !this.bioExpanded;
  }

  // Convert to method that takes person as parameter
  getBiographyParagraphs(person: any): string[] {
    if (!person?.biography) return [];
    return person.biography.split('\n').filter((p: string) => p.trim());
  }
}
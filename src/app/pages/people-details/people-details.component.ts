import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { KnownForRowComponent } from '../../components/known-for-row/known-for-row.component';
import { Observable, map, switchMap, Subject, takeUntil, catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-people-details',
  standalone: true,
  imports: [CommonModule, KnownForRowComponent],
  templateUrl: './people-details.component.html',
  styleUrl: './people-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  person$!: Observable<any>;
  knownFor$!: Observable<any[]>;
  bioExpanded = false;

  constructor(private route: ActivatedRoute, private tmdb: TmdbService) {}

  ngOnInit() {
    const personId$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      takeUntil(this.destroy$)
    );

    this.person$ = personId$.pipe(
      switchMap(id => this.tmdb.getPersonDetails(id)),
      catchError(error => {
        console.error('Failed to load person:', error);
        return EMPTY;
      })
    );

    this.knownFor$ = personId$.pipe(
      switchMap(id => this.tmdb.getPersonCombinedCredits(id)),
      map(data => (data?.cast || []).slice(0, 10)),
      catchError(error => {
        console.error('Failed to load known for:', error);
        return EMPTY;
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  toggleBio() {
    this.bioExpanded = !this.bioExpanded;
  }

  getBiographyParagraphs(person: any): string[] {
    if (!person?.biography) return [];
    return person.biography.split('\n').filter((p: string) => p.trim());
  }

  getAge(birthday: string): number {
    if (!birthday) return 0;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  getAgeAtDeath(birthday: string, deathday: string): number {
    if (!birthday || !deathday) return 0;
    const birthDate = new Date(birthday);
    const deathDate = new Date(deathday);
    let age = deathDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = deathDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && deathDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}
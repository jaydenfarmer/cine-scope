import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesTopRatedComponent } from './movies-top-rated.component';

describe('MoviesTopRatedComponent', () => {
  let component: MoviesTopRatedComponent;
  let fixture: ComponentFixture<MoviesTopRatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesTopRatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesTopRatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

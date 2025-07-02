import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvAiringTodayComponent } from './tv-airing-today.component';

describe('TvAiringTodayComponent', () => {
  let component: TvAiringTodayComponent;
  let fixture: ComponentFixture<TvAiringTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvAiringTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvAiringTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

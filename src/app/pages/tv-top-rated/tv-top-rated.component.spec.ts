import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvTopRatedComponent } from './tv-top-rated.component';

describe('TvTopRatedComponent', () => {
  let component: TvTopRatedComponent;
  let fixture: ComponentFixture<TvTopRatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvTopRatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvTopRatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

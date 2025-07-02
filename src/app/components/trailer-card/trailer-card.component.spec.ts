import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerCardComponent } from './trailer-card.component';

describe('TrailerCardComponent', () => {
  let component: TrailerCardComponent;
  let fixture: ComponentFixture<TrailerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

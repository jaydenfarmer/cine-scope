import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerRowComponent } from './trailer-row.component';

describe('TrailerRowComponent', () => {
  let component: TrailerRowComponent;
  let fixture: ComponentFixture<TrailerRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

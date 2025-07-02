import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplePopularComponent } from './people-popular.component';

describe('PeoplePopularComponent', () => {
  let component: PeoplePopularComponent;
  let fixture: ComponentFixture<PeoplePopularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoplePopularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeoplePopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

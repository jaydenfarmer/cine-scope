import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnownForRowComponent } from './known-for-row.component';

describe('KnownForRowComponent', () => {
  let component: KnownForRowComponent;
  let fixture: ComponentFixture<KnownForRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnownForRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnownForRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

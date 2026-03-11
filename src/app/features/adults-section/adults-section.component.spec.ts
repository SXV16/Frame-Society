import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdultsSectionComponent } from './adults-section.component';

describe('AdultsSectionComponent', () => {
  let component: AdultsSectionComponent;
  let fixture: ComponentFixture<AdultsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdultsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdultsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

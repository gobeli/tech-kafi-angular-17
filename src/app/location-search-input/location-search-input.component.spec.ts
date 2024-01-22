import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSearchInputComponent } from './location-search-input.component';

describe('LocationSearchInputComponent', () => {
  let component: LocationSearchInputComponent;
  let fixture: ComponentFixture<LocationSearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSearchInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

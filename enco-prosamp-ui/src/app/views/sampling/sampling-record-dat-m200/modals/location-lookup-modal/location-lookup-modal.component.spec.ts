import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationLookupModalComponent } from './location-lookup-modal.component';

describe('LocationLookupModalComponent', () => {
  let component: LocationLookupModalComponent;
  let fixture: ComponentFixture<LocationLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

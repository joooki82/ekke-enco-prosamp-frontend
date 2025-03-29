import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardLookupModalComponent } from './standard-lookup-modal.component';

describe('StandardLookupModalComponent', () => {
  let component: StandardLookupModalComponent;
  let fixture: ComponentFixture<StandardLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

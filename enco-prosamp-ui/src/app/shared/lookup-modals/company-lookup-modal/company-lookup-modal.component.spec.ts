import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLookupModalComponent } from './company-lookup-modal.component';

describe('CompanyLookupModalComponent', () => {
  let component: CompanyLookupModalComponent;
  let fixture: ComponentFixture<CompanyLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

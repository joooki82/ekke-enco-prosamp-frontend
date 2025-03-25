import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingRecordLookupModalComponent } from './sampling-record-lookup-modal.component';

describe('SamplingRecordLookupModalComponent', () => {
  let component: SamplingRecordLookupModalComponent;
  let fixture: ComponentFixture<SamplingRecordLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplingRecordLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplingRecordLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

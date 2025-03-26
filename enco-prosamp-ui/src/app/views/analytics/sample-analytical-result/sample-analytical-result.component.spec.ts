import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAnalyticalResultComponent } from './sample-analytical-result.component';

describe('SampleAnalyticalResultComponent', () => {
  let component: SampleAnalyticalResultComponent;
  let fixture: ComponentFixture<SampleAnalyticalResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleAnalyticalResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleAnalyticalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

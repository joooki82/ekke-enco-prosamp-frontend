import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalLabReportComponent } from './analytical-lab-report.component';

describe('AnalyticalLabReportComponent', () => {
  let component: AnalyticalLabReportComponent;
  let fixture: ComponentFixture<AnalyticalLabReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticalLabReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticalLabReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

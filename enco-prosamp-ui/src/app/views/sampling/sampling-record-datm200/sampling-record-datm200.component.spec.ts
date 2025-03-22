import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingRecordDatm200Component } from './sampling-record-datm200.component';

describe('SamplingRecordDatm200Component', () => {
  let component: SamplingRecordDatm200Component;
  let fixture: ComponentFixture<SamplingRecordDatm200Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplingRecordDatm200Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplingRecordDatm200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

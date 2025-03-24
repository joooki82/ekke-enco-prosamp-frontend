import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingRecordDatM200Component } from './sampling-record-dat-m200.component';

describe('SamplingRecordDatM200Component', () => {
  let component: SamplingRecordDatM200Component;
  let fixture: ComponentFixture<SamplingRecordDatM200Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplingRecordDatM200Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplingRecordDatM200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplingTypeComponent } from './sampling-type.component';

describe('SamplingTypeComponent', () => {
  let component: SamplingTypeComponent;
  let fixture: ComponentFixture<SamplingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplingTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

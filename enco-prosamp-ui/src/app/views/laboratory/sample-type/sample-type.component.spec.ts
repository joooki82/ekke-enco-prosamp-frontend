import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTypeComponent } from './sample-type.component';

describe('SampleTypeComponent', () => {
  let component: SampleTypeComponent;
  let fixture: ComponentFixture<SampleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

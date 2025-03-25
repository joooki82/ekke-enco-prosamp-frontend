import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleContaminantLinkComponent } from './sample-contaminant-link.component';

describe('SampleContaminantLinkComponent', () => {
  let component: SampleContaminantLinkComponent;
  let fixture: ComponentFixture<SampleContaminantLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampleContaminantLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleContaminantLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

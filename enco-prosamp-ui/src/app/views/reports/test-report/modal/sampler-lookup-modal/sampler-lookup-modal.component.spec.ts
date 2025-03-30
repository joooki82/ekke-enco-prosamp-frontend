import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplerLookupModalComponent } from './sampler-lookup-modal.component';

describe('SamplerLookupModalComponent', () => {
  let component: SamplerLookupModalComponent;
  let fixture: ComponentFixture<SamplerLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SamplerLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplerLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

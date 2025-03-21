import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppToastSampleComponent } from './app-toast-sample.component';

describe('AppToastSampleComponent', () => {
  let component: AppToastSampleComponent;
  let fixture: ComponentFixture<AppToastSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppToastSampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppToastSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

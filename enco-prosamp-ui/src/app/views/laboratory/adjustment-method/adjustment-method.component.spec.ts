import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentMethodComponent } from './adjustment-method.component';

describe('AdjustmentMethodComponent', () => {
  let component: AdjustmentMethodComponent;
  let fixture: ComponentFixture<AdjustmentMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdjustmentMethodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdjustmentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

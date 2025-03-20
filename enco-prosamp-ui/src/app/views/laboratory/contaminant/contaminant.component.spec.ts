import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaminantComponent } from './contaminant.component';

describe('ContaminantComponent', () => {
  let component: ContaminantComponent;
  let fixture: ComponentFixture<ContaminantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaminantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaminantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

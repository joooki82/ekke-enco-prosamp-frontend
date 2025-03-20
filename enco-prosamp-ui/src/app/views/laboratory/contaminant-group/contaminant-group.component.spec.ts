import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaminantGroupComponent } from './contaminant-group.component';

describe('ContaminantGroupComponent', () => {
  let component: ContaminantGroupComponent;
  let fixture: ComponentFixture<ContaminantGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaminantGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaminantGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

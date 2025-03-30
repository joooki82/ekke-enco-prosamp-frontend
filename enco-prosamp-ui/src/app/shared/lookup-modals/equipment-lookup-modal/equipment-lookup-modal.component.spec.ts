import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentLookupModalComponent } from './equipment-lookup-modal.component';

describe('EquipmentLookupModalComponent', () => {
  let component: EquipmentLookupModalComponent;
  let fixture: ComponentFixture<EquipmentLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

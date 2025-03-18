import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintaveteliBeallitasModjaComponent } from './mintaveteli-beallitas-modja.component';

describe('MintaveteliBeallitasModjaComponent', () => {
  let component: MintaveteliBeallitasModjaComponent;
  let fixture: ComponentFixture<MintaveteliBeallitasModjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MintaveteliBeallitasModjaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintaveteliBeallitasModjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

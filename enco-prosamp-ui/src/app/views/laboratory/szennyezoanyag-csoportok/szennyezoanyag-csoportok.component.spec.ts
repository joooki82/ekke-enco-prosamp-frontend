import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SzennyezoanyagCsoportokComponent } from './szennyezoanyag-csoportok.component';

describe('SzennyezoanyagCsoportokComponent', () => {
  let component: SzennyezoanyagCsoportokComponent;
  let fixture: ComponentFixture<SzennyezoanyagCsoportokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SzennyezoanyagCsoportokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SzennyezoanyagCsoportokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

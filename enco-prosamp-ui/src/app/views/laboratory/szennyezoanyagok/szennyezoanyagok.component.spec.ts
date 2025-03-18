import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SzennyezoanyagokComponent } from './szennyezoanyagok.component';

describe('SzennyezoanyagokComponent', () => {
  let component: SzennyezoanyagokComponent;
  let fixture: ComponentFixture<SzennyezoanyagokComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SzennyezoanyagokComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SzennyezoanyagokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

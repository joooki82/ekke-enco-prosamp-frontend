import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLookupModalComponent } from './client-lookup-modal.component';

describe('ClientLookupModalComponent', () => {
  let component: ClientLookupModalComponent;
  let fixture: ComponentFixture<ClientLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

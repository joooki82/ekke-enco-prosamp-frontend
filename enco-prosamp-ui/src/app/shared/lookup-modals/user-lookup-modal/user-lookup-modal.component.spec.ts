import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLookupModalComponent } from './user-lookup-modal.component';

describe('UserLookupModalComponent', () => {
  let component: UserLookupModalComponent;
  let fixture: ComponentFixture<UserLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

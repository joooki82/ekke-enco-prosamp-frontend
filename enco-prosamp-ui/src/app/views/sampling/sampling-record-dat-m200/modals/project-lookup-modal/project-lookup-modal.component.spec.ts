import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLookupModalComponent } from './project-lookup-modal.component';

describe('ProjectLookupModalComponent', () => {
  let component: ProjectLookupModalComponent;
  let fixture: ComponentFixture<ProjectLookupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLookupModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLookupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

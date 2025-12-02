import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubroganteComponent } from './new-subrogante.component';

describe('NewSubroganteComponent', () => {
  let component: NewSubroganteComponent;
  let fixture: ComponentFixture<NewSubroganteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSubroganteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSubroganteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

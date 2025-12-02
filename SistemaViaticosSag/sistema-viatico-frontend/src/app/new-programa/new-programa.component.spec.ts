import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProgramaComponent } from './new-programa.component';

describe('NewProgramaComponent', () => {
  let component: NewProgramaComponent;
  let fixture: ComponentFixture<NewProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProgramaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

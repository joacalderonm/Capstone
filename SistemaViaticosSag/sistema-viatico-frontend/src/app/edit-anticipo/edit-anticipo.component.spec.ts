import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnticipoComponent } from './edit-anticipo.component';

describe('EditAnticipoComponent', () => {
  let component: EditAnticipoComponent;
  let fixture: ComponentFixture<EditAnticipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAnticipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAnticipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
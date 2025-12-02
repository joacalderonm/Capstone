import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUnidadComponent } from './new-unidad.component';

describe('NewUnidadComponent', () => {
  let component: NewUnidadComponent;
  let fixture: ComponentFixture<NewUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewUnidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
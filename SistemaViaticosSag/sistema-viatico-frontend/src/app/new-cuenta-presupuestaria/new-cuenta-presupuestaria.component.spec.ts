import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCuentaPresupuestariaComponent } from './new-cuenta-presupuestaria.component';

describe('NewCuentaPresupuestariaComponent', () => {
  let component: NewCuentaPresupuestariaComponent;
  let fixture: ComponentFixture<NewCuentaPresupuestariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCuentaPresupuestariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCuentaPresupuestariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

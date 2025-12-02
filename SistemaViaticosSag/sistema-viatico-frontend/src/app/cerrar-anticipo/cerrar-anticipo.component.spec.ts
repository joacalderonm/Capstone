import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarAnticipoComponent } from './cerrar-anticipo.component';

describe('CerrarAnticipoComponent', () => {
  let component: CerrarAnticipoComponent;
  let fixture: ComponentFixture<CerrarAnticipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarAnticipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarAnticipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
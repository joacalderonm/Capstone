import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarPlanillaComponent } from './cerrar-planilla.component';

describe('CerrarPlanillaComponent', () => {
  let component: CerrarPlanillaComponent;
  let fixture: ComponentFixture<CerrarPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarPlanillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

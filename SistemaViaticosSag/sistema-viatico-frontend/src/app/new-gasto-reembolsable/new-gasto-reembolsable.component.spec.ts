import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGastoReembolsableComponent } from './new-gasto-reembolsable.component';

describe('NewGastoReembolsableComponent', () => {
  let component: NewGastoReembolsableComponent;
  let fixture: ComponentFixture<NewGastoReembolsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGastoReembolsableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGastoReembolsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
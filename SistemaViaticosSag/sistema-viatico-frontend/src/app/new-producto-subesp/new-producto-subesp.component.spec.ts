import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductoSubespComponent } from './new-producto-subesp.component';

describe('NewProductoSubespComponent', () => {
  let component: NewProductoSubespComponent;
  let fixture: ComponentFixture<NewProductoSubespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductoSubespComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductoSubespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

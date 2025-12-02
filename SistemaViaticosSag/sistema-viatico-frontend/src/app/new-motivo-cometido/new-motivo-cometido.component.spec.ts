import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMotivoCometidoComponent } from './new-motivo-cometido.component';

describe('NewMotivoCometidoComponent', () => {
  let component: NewMotivoCometidoComponent;
  let fixture: ComponentFixture<NewMotivoCometidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewMotivoCometidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMotivoCometidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

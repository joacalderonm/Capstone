import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewViaticoComponent } from './new-viatico.component';

describe('NewViaticoComponent', () => {
  let component: NewViaticoComponent;
  let fixture: ComponentFixture<NewViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
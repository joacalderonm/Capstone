import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAnticipoComponent } from './new-anticipo.component';

describe('NewAnticipoComponent', () => {
  let component: NewAnticipoComponent;
  let fixture: ComponentFixture<NewAnticipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAnticipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAnticipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
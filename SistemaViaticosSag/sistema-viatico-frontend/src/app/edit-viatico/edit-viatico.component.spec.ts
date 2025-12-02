import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditViaticoComponent } from './edit-viatico.component';

describe('EditViaticoComponent', () => {
  let component: EditViaticoComponent;
  let fixture: ComponentFixture<EditViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

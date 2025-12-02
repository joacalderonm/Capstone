import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarmovilComponent } from './sidebarmovil.component';

describe('SidebarmovilComponent', () => {
  let component: SidebarmovilComponent;
  let fixture: ComponentFixture<SidebarmovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarmovilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarmovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypevehiculesComponent } from './typevehicules.component';

describe('TypevehiculesComponent', () => {
  let component: TypevehiculesComponent;
  let fixture: ComponentFixture<TypevehiculesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypevehiculesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypevehiculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

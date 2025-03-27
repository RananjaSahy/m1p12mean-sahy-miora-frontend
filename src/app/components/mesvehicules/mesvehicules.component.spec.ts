import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesvehiculesComponent } from './mesvehicules.component';

describe('MesvehiculesComponent', () => {
  let component: MesvehiculesComponent;
  let fixture: ComponentFixture<MesvehiculesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesvehiculesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesvehiculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecaniciensComponent } from './mecaniciens.component';

describe('MecaniciensComponent', () => {
  let component: MecaniciensComponent;
  let fixture: ComponentFixture<MecaniciensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MecaniciensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MecaniciensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

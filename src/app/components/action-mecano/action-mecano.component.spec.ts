import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMecanoComponent } from './action-mecano.component';

describe('ActionMecanoComponent', () => {
  let component: ActionMecanoComponent;
  let fixture: ComponentFixture<ActionMecanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMecanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionMecanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

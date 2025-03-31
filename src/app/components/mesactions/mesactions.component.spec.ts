import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesactionsComponent } from './mesactions.component';

describe('MesactionsComponent', () => {
  let component: MesactionsComponent;
  let fixture: ComponentFixture<MesactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

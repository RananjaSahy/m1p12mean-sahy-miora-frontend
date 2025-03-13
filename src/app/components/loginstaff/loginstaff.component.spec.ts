import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginstaffComponent } from './loginstaff.component';

describe('LoginstaffComponent', () => {
  let component: LoginstaffComponent;
  let fixture: ComponentFixture<LoginstaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginstaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginstaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

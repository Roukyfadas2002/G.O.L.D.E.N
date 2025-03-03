import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutWarningComponent } from './logout-warning.component';

describe('LogoutWarningComponent', () => {
  let component: LogoutWarningComponent;
  let fixture: ComponentFixture<LogoutWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoutWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

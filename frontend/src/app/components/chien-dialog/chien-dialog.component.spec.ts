import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChienDialogComponent } from './chien-dialog.component';

describe('ChienDialogComponent', () => {
  let component: ChienDialogComponent;
  let fixture: ComponentFixture<ChienDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChienDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChienDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

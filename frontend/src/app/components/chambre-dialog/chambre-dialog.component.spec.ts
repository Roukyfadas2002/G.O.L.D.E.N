import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreDialogComponent } from './chambre-dialog.component';

describe('ChambreDialogComponent', () => {
  let component: ChambreDialogComponent;
  let fixture: ComponentFixture<ChambreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambreDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

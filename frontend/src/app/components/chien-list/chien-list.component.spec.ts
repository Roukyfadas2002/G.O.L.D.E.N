import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChienListComponent } from './chien-list.component';

describe('ChienListComponent', () => {
  let component: ChienListComponent;
  let fixture: ComponentFixture<ChienListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChienListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChienListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

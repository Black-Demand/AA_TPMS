import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDriverComponent } from './penalty-driver.component';

describe('PenaltyDriverComponent', () => {
  let component: PenaltyDriverComponent;
  let fixture: ComponentFixture<PenaltyDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyDriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

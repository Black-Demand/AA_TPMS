import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDifComponent } from './penalty-dif.component';

describe('PenaltyDifComponent', () => {
  let component: PenaltyDifComponent;
  let fixture: ComponentFixture<PenaltyDifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyDifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenaltyDifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

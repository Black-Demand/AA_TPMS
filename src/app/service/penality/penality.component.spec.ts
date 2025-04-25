import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenalityComponent } from './penality.component';

describe('PenalityComponent', () => {
  let component: PenalityComponent;
  let fixture: ComponentFixture<PenalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenalityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficSearchComponent } from './traffic-search.component';

describe('TrafficSearchComponent', () => {
  let component: TrafficSearchComponent;
  let fixture: ComponentFixture<TrafficSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

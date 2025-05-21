import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspensionSearchComponent } from './suspension-search.component';

describe('SuspensionSearchComponent', () => {
  let component: SuspensionSearchComponent;
  let fixture: ComponentFixture<SuspensionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspensionSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspensionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

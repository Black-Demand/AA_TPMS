import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryRegistraionComponent } from './temporary-registraion.component';

describe('TemporaryRegistraionComponent', () => {
  let component: TemporaryRegistraionComponent;
  let fixture: ComponentFixture<TemporaryRegistraionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemporaryRegistraionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryRegistraionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentalPinValidatorComponent } from './parental-pin-validator.component';

describe('ParentalPinValidatorComponent', () => {
  let component: ParentalPinValidatorComponent;
  let fixture: ComponentFixture<ParentalPinValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentalPinValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentalPinValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

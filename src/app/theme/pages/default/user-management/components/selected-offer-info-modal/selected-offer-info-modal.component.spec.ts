import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedOfferInfoModalComponent } from './selected-offer-info-modal.component';

describe('SelectedOfferInfoModalComponent', () => {
  let component: SelectedOfferInfoModalComponent;
  let fixture: ComponentFixture<SelectedOfferInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedOfferInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedOfferInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

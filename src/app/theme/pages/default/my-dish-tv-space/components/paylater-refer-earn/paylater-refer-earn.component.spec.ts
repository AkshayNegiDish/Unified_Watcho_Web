import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaylaterReferEarnComponent } from './paylater-refer-earn.component';

describe('PaylaterReferEarnComponent', () => {
  let component: PaylaterReferEarnComponent;
  let fixture: ComponentFixture<PaylaterReferEarnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaylaterReferEarnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaylaterReferEarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelMembershipComponent } from './cancel-membership.component';

describe('CancelMembershipComponent', () => {
  let component: CancelMembershipComponent;
  let fixture: ComponentFixture<CancelMembershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelMembershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

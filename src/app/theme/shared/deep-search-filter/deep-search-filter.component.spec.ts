import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepSearchFilterComponent } from './deep-search-filter.component';

describe('DeepSearchFilterComponent', () => {
  let component: DeepSearchFilterComponent;
  let fixture: ComponentFixture<DeepSearchFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeepSearchFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeepSearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

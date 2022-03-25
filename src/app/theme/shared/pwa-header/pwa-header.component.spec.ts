import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaHeaderComponent } from './pwa-header.component';

describe('PwaHeaderComponent', () => {
  let component: PwaHeaderComponent;
  let fixture: ComponentFixture<PwaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

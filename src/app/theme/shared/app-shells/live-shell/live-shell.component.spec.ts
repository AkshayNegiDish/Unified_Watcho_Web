import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveShellComponent } from './live-shell.component';

describe('LiveShellComponent', () => {
  let component: LiveShellComponent;
  let fixture: ComponentFixture<LiveShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UgcPlayerComponent } from './ugc-player.component';

describe('UgcPlayerComponent', () => {
  let component: UgcPlayerComponent;
  let fixture: ComponentFixture<UgcPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UgcPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UgcPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

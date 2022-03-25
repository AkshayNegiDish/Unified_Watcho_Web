import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSecondConnectionsComponent } from './get-second-connections.component';

describe('GetSecondConnectionsComponent', () => {
  let component: GetSecondConnectionsComponent;
  let fixture: ComponentFixture<GetSecondConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetSecondConnectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSecondConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

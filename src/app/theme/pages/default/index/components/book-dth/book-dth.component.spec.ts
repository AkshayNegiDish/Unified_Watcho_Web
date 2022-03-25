import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDTHComponent } from './book-dth.component';

describe('BookDTHComponent', () => {
  let component: BookDTHComponent;
  let fixture: ComponentFixture<BookDTHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDTHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDTHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

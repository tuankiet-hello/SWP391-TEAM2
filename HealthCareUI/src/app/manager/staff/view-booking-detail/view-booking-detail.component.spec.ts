import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBookingDetailComponent } from './view-booking-detail.component';

describe('ViewBookingDetailComponent', () => {
  let component: ViewBookingDetailComponent;
  let fixture: ComponentFixture<ViewBookingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBookingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBookingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

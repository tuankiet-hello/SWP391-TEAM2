import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SexualTestingComponent } from './sexual-testing.component';

describe('SexualTestingComponent', () => {
  let component: SexualTestingComponent;
  let fixture: ComponentFixture<SexualTestingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SexualTestingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SexualTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

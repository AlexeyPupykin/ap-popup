import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApPopupComponent } from './ap-popup.component';

describe('ApPopupComponent', () => {
  let component: ApPopupComponent;
  let fixture: ComponentFixture<ApPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

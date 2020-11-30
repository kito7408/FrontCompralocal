import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProdDetailComponent } from './prod-detail.component';

describe('ProdDetailComponent', () => {
  let component: ProdDetailComponent;
  let fixture: ComponentFixture<ProdDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

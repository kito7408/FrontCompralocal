import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccErrMesagesComponent } from './succ-err-mesages.component';

describe('SuccErrMesagesComponent', () => {
  let component: SuccErrMesagesComponent;
  let fixture: ComponentFixture<SuccErrMesagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccErrMesagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccErrMesagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

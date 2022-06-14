import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlpacaNavbarComponent } from './alpaca-navbar.component';

describe('AlpacaNavbarComponent', () => {
  let component: AlpacaNavbarComponent;
  let fixture: ComponentFixture<AlpacaNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlpacaNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlpacaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

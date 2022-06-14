import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlpacaHomeComponent } from './alpaca-home.component';

describe('AlpacaHomeComponent', () => {
  let component: AlpacaHomeComponent;
  let fixture: ComponentFixture<AlpacaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlpacaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlpacaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

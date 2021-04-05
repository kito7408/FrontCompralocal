import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-succ-err-mesages',
  templateUrl: './succ-err-mesages.component.html',
  styleUrls: ['./succ-err-mesages.component.css']
})
export class SuccErrMesagesComponent implements OnInit {

  successAlert: boolean;
  errorAlert: boolean;
  successMessage: string;
  errorMessage: string;

  constructor() { }

  ngOnInit(): void {
  }


  successEvent(msg: string) {
    this.successAlert = true;
    this.successMessage = msg;
    setTimeout(() => {
      this.successAlert = false;
      this.successMessage = '';
    }, 3000);
  }

  errorEvent(msg: string) {
    this.errorAlert = true;
    this.errorMessage = msg
    setTimeout(() => {
      this.errorAlert = false;
      this.errorMessage = '';
    }, 3000);
  }

}

import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-log-reg',
  templateUrl: './log-reg.component.html',
  styleUrls: ['./log-reg.component.css']
})
export class LogRegComponent implements OnInit {

  imgHeigh: number;
  logUsername: string;
  logPass: string;
  loading: boolean;

  @Output() userEvent = new EventEmitter;

  constructor(
    public userService: UserService,
  ) { 
    this.logUsername = '';
    this.logPass = '';
    this.loading = false;
    localStorage.removeItem('userToLog');
  }

  ngOnInit(): void {
    this.imgHeigh = window.innerHeight;
  }

  newUserPopUp(){
    this.userEvent.emit('register');
  }

  login(){
    let uservalues = {user: this.logUsername, pass: this.logPass};
    localStorage.setItem('userToLog', JSON.stringify(uservalues));
    this.userEvent.emit('login');
  }

  logout(){
    this.userEvent.emit('logout');
  }

  myOrds(){
    this.userEvent.emit('myOrds');
  }

  myDirs(){

  }

  myInfo(){

  }

  addProd(){
    this.userEvent.emit('addProd');
  }

  addUser(){
    this.userEvent.emit('addUser');
  }

  listOrds(){
    this.userEvent.emit('allOrds');
  }
}

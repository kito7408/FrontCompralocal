import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InfoContacto } from '../classes/infoContacto';
import { InfoContactoService } from '../services/info-contacto.service';
import { SuccErrMesagesComponent } from '../succ-err-mesages/succ-err-mesages.component';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

  imgHeigh: number;
  moving: boolean = false;
  newContact = new InfoContacto;
  loading: boolean = false;

  @ViewChild('alertComp') alertComp: SuccErrMesagesComponent;

  constructor(
    private contactService: InfoContactoService
  ) { }

  ngOnInit(): void {
    this.imgHeigh = window.innerHeight;
  }

  goto(id_plan: number){
    // document.getElementById('small-screen').children.item(id_plan).scrollIntoView({behavior: 'smooth'});
    document.getElementById('big-screen').children.item(id_plan).scrollIntoView({behavior: 'smooth'});
  }

  contact(form: NgForm){
    if (form.valid) {
      this.loading = true;
      this.contactService.save(this.newContact).subscribe((dataContact) => {
        this.alertComp.successEvent('La información ha sido enviada, en breve estaremos en contacto contigo.')
        this.newContact = new InfoContacto;
        this.loading = false;
      });
    }
  }
}

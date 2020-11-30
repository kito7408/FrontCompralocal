import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supplier } from '../classes/supplier';
import { SupplierService } from '../services/supplier.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: String;

  suppId: number;
  supplier: Supplier;

  constructor(
    private suppService: SupplierService,
    private route: ActivatedRoute
    ) {
    this.lat = 40;
    this.lng = -3;
    this.zoom = 6;
    this.mapTypeId = 'hybrid';

    this.route.params.subscribe((params) => {
      this.suppId = params['id'];
      this.suppService.getById(this.suppId).subscribe((data) => {
        this.supplier = data;
      });
    });
   }

  ngOnInit() {
  }

}

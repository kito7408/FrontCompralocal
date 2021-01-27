import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { Supplier } from '../classes/supplier';
import { ProductsComponent } from '../products/products.component';
import { ProductService } from '../services/product.service';
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
  @ViewChild('prodComp') prodComp: ProductsComponent;

  suppId: number;
  supplier: Supplier;
  educacion: boolean;
  reforestacion: boolean;

  constructor(
    private suppService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private prodService: ProductService
    ) {
    this.lat = 40;
    this.lng = -3;
    this.zoom = 6;
    this.mapTypeId = 'terrain';

    if (this.router.url == '/educacion') {
      this.educacion = true;
    } else if (this.router.url == '/reforestacion') {
      this.reforestacion = true;
    } else {
      this.route.params.subscribe((params) => {
        this.suppId = params['id'];
        this.suppService.getById(this.suppId).subscribe((data) => {
          this.supplier = data;
          this.prodService.filterType = 5;
          this.prodService.filter = String(this.suppId);
          this.prodComp.listProducts();
        });
      });
    }
   }

  ngOnInit() {
  }

}

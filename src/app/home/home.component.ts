import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { blogItemGet } from '../classes/blogItemGet';
import { CategoryGet } from '../classes/categoryGet';
import { Supplier } from '../classes/supplier';
import { ProductsComponent } from '../products/products.component';
import { BlogService } from '../services/blog.service';
import { CategoriaService } from '../services/categoria.service';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';
import * as moment from 'moment';
declare function carouselFunc(e);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  categorias: CategoryGet[];
  suppliers: Supplier[];
  lastPost: any;
  @ViewChild('prodComp') prodComp: ProductsComponent;

  constructor(
    private catService: CategoriaService,
    private routes: Router,
    private prodService: ProductService,
    private suppService: SupplierService,
    private blogService: BlogService
  ) {
    this.getCategorias();
    this.getSuppliers();
    this.getLastPost();
  }

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }

  getCategorias() {
    this.catService.getAll().subscribe((data: CategoryGet[]) => {
      this.categorias = data;
    });
  }

  getSuppliers() {
    this.suppService.getAll().subscribe((data: Supplier[]) => {
      this.suppliers = data;
    });
  }

  getLastPost() {
    this.blogService.getLast().subscribe((data: blogItemGet) => {
      this.lastPost = data;
      this.lastPost.date = moment.utc(this.lastPost.createdAt).format('DD/MM/YYYY').toString();

    });
  }

  goToCategory(id: number) {
    this.prodService.filterType = 1;
    this.prodService.filter = String(id);
    this.routes.navigate(['/products']);
  }

  sortByBuyed() {
    this.prodService.filterType = 4;
    this.prodService.filter = '';
    this.prodComp.listProducts();
  }

  filterProds(type: number) {
    switch (type) {
      case 1:

        break;
      case 2:

        break;
      case 3:
        this.sortByBuyed();
        break;

      default:
        break;
    }
  }
}

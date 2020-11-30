import { Component, OnInit } from '@angular/core';
import { ProductGet } from '../classes/productGet';
import { ProductPost } from '../classes/productPost';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productos: ProductGet[];
  prodPerPage: number = 5;
  prodOnPage: ProductGet[];
  actualPage: number;
  numberOfPages: number;
  filterString: string;
  searching: boolean;
  noProds: boolean;
  compName: string;

  constructor(private prodService: ProductService) {
    this.actualPage = 1;
    this.numberOfPages = 1;
    this.searching = false;
    this.noProds = false;
    this.compName = 'Productos';
    this.listProducts();
  }

  ngOnInit() {
  }

  counter(i: number) {
    return new Array(i);
  }

  listProducts() {
    this.filterString = 'Productos';
    this.searching = false;

    switch (this.prodService.filterType) {
      case 0:
        this.prodService.getAll().subscribe((data) => {
          this.productos = data;
          this.startPag();
        });
        break;
      case 1:
        this.prodService.getByCategoriaId(Number(this.prodService.filter)).subscribe((data) => {
          this.productos = data;
          if (data && data.length > 0) {
            this.filterString = "Productos > " + data[0].category.name;
          }
          this.startPag();
        });
        break;
      case 2:
        this.prodService.getBySubCategoriaId(Number(this.prodService.filter)).subscribe((data) => {
          this.productos = data;
          if(data && data.length > 0){
            this.filterString = "Productos > " + data[0].category.name + " > " + data[0].subcategory.name;
          }
          this.startPag();
        });
        break;
      case 3:
        this.prodService.getBySearch(this.prodService.filter).subscribe((data) => {
          this.filterString = 'Palabra buscada: ' + this.prodService.filter;
          this.searching = true;
          this.productos = data;
          this.startPag();
        });
        break;

      default:
        break;
    }
  }

  startPag() {
    this.numberOfPages = Math.floor(this.productos.length / this.prodPerPage);
    if (this.productos.length % this.prodPerPage != 0) {
      this.numberOfPages += 1;
    }
    this.actualPage = 1;
    this.paginate();
  }

  paginate() {
    this.noProds = false;

    this.prodOnPage = this.productos.slice(this.prodPerPage * (this.actualPage - 1), this.prodPerPage * this.actualPage);
    if (this.prodOnPage.length == 0) {
      this.noProds = true;
    }
  }

  nextPage() {
    this.actualPage += 1;
    this.paginate();
  }

  prevPage() {
    this.actualPage -= 1;
    this.paginate();
  }

  selectPage(page: number) {
    this.actualPage = page;
    this.paginate();
  }

}

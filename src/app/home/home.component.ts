import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryGet } from '../classes/categoryGet';
import { ProductsComponent } from '../products/products.component';
import { CategoriaService } from '../services/categoria.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  categorias: CategoryGet[];
  @ViewChild('prodComp') prodComp:ProductsComponent;
  
  constructor(
    private catService: CategoriaService,
    private routes: Router,
    private prodService: ProductService
    ) { 
    this.getCategorias()
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

  goToCategory(id: number){
    this.prodService.filterType = 1;
    this.prodService.filter = String(id);
    this.routes.navigate(['/products']);
  }

  sortByBuyed(){
    this.prodService.filterType = 4;
    this.prodService.filter = '';
    this.prodComp.listProducts();
  }
}

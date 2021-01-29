import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CompraLocal';

  compo: any;

  onActivate(componentReference) {
    this.compo = componentReference;
  }

  emitterAction(e) {
    
    switch (e) {
      case 'products':
        this.compo.listProducts();
        break;

      case 'suppliers':      //cuando se agregan proveedores
        this.compo.getSuppliers();
        break;

      default:
        break;
    }
  }
  
}

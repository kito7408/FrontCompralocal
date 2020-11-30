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

  listProd() {
    if (this.compo.compName == 'Productos') {
      this.compo.listProducts();
    }
  }
}

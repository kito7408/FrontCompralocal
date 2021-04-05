import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-how-works',
  templateUrl: './how-works.component.html',
  styleUrls: ['./how-works.component.css']
})
export class HowWorksComponent implements OnInit {

  systemSteps = [
    {
      title: "Registrate",
      content: `Vamos a crear una relación de confianza, por ello necesitamos conocernos. 
      Regístrate aquí de una manera segura y confiable. 
      De acá en adelante, cada paso que des contarás con cada uno de nosotros, la familia de CompraLocal. 
      Si tienes alguna duda, contáctanos.`,
      showing: false
    },
    {
      title: "Haz tu pedido online",
      content: `A través de nuestra plataforma on Line, podrás encontrar todos los productos que
      necesitas y agregarlos a tu carrito de compras. Para darte mayor seguridad, trabajamos
      con Culqui, una de las plataformas de pago más seguras para compras online.
      Recuerda que antes de finalizar tu compra, podrás seleccionar que proyecto apoyar, a
      quienes se les dará un porcentaje de los ingresos por las ventas.`,
      showing: false
    },
    {
      title: "Tu pedido se envía directamente al productor",
      content: `La plataforma está programada para que una vez realizado el pago, se emita una
      alerta con tu pedido al productor, quien se encargará de preparar tus productos.`,
      showing: false
    },
    {
      title: "Recibimos y entregamos tu compra",
      content: `Una vez recibida la orden de compra, tu entrega se programará en un plazo de entre
      48 a 72 horas, tiempo en el cuál recibiremos tus productos y procederemos a entregarlos
      con toda la seguridad del caso.`,
      showing: false
    },
    {
      title: "No olvides",
      content: `Nuestra motivación es:
      <br>
      <div class="ml-3">
          a. Impulsar el desarrollo de familias independientes. <br>
          b. Promover la solidaridad dentro del país, promover el cuidado y
          respeto por nuestro entorno socioambiental y generar fortaleza, seguridad y
          felicidad entre los productores locales. <br>
          c. Promover una economía más equitativa e impulsar el crecimiento del país. <br><br>
      </div>
      Por ahora, nuestro alcance principal es en Lima Metropolitana. Sin embargo, ya estamos
      trabajando para llegar a todo el Perú e inclusive para poder brindarle a todo el mundo
      la calidad y el placer de tener nuestros productos en sus hogares.<br>
      No te alejes que lo que está por venir cambiará nuestro país.`,
      showing: true
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  show_hideContent(i: number){
    if (i < this.systemSteps.length - 1) {
      this.systemSteps[i].showing = !this.systemSteps[i].showing;
    }
  }
}

import { Component , inject} from "@angular/core";
import { AsyncPipe , CurrencyPipe } from "@angular/common";
import { CartServiceObServables } from "../../services/cart/cart.service.observables";
import { ProductFromApi } from "../../models/product.from.api";

@Component({
 selector : 'app-navbar-component',
 imports : [AsyncPipe , CurrencyPipe],
 template : `
    <nav style="padding: 1rem; background: #333; color: white; display: flex; justify-content: space-between;">
      <span>🏪 Mi Tienda Senior (RxJS Puro)</span>
      <!-- 🎯 Conectamos el Observable directo al HTML usando la cañería '| async' -->

      <span>🛒 Carrito: <strong>{{ totalQty$ | async }}</strong> artículos</span>

       <div style="display: flex; align-items:center; justify-items: center; flex:1; flex-direction:column;">Agregar carrito:
        
         <button (click)="handleAddToCart()">Añadir zapatillas</button>
       </div>

      <div class="cart-preview">
      <h3>Productos en el Carrito</h3>
       @for (item of (cart$ | async) ; track item.product.id) {
        <div class="cart-item" style="display: flex; gap: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem;">
      <img [src]="item.product.image" [alt]="item.product.title" width="50">
      <div>
        <h4>{{ item.product.title }}</h4>
        <p>Cantidad: <strong>{{ item.quantity }}</strong> - Precio: {{ item.product.price | currency }}</p>
      </div>
    </div>
     }
     @empty {
       <p>El carrito está vacío. ¡Ve al catálogo a comprar!</p>

     }


      </div>
    </nav>
    
  `

})

export class NavbarComponent {
 private cartServiceOb = inject(CartServiceObServables)

 public cart$ = this.cartServiceOb.cart$
 public totalQty$ = this.cartServiceOb.totalItems$;

 handleAddToCart() {
  const product : ProductFromApi = {
   id :1,
  title: "zapatilla",
  price: 39.99,
  description: "Zapatillas ultra cool",
  category: "zapatillas category",
  image: "https//:default-image.com"
  }
  this.cartServiceOb.addToCart(product);
 }

}
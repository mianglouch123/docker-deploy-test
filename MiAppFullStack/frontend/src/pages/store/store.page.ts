import { Component, inject } from "@angular/core"; // 💡 Importamos inject
import { CartService } from "../../services/cart/cart.services";
import { CardComponent } from '../../components/Card/Card.component';
import { PRODUCT_LIST, Product } from '../../mocks/products.mocks';
import { CurrencyPipe } from "@angular/common";

@Component({
 selector: 'app-store',
 standalone: true,
 imports: [CardComponent, CurrencyPipe],
 template: `
    <div style="border: 2px solid black; padding: 20px;">
      <h2>🛒 Nuestra Tienda</h2>
     
      <div>
        <h2>Carrito de compras (Desde Servicio)</h2>
        <!-- 💡 Consumimos las signals del servicio abriendo paréntesis directamente -->
        <p>Productos en el carrito: {{ cartService.productsCount() }}</p>
        <p>Precio total: {{ cartService.totalPrice() | currency }}</p>
        <button (click)="cartService.clearCart()">Vaciar carrito</button>
      </div>
   
      @for (product of PRODUCT_LIST; track product.id) {
        <app-card 
          (onShowAlert)="handleAlert($event)"
          [product]="product"
          (onAddToCart)="cartService.addToCart($event)">
        </app-card>
      }
    </div>
 `
})
export class StorePage {
  protected readonly PRODUCT_LIST = PRODUCT_LIST;
  protected readonly cartService = inject(CartService); // 💡 Inyectamos el servicio de carrito

  // 💉 INYECCIÓN DE DEPENDENCIAS: El equivalente a const cart = useCart()


  handleAlert(product: Product) {
    alert(`¡Has seleccionado: ${product.nombre}!`);
  }
}

import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from "@angular/common"
import { Product } from '../../mocks/products.mocks';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; text-align: center; width: 200px;">
      <span style="font-size: 3rem;">{{ product().imagen }}</span>
      <h3>{{ product().nombre }}</h3>
      <p style="font-weight: bold; color: green;">{{ product().precio | currency}}</p>
      <button (click)="onNotify()" >Notificar producto.</button>
      <button (click)="handleAddToCart()" >Agregar al carrito</button>
    </div>
  `,
})
export class CardComponent {
  readonly product = input.required<Product>();
  readonly onShowAlert = output<Product>();
  readonly onAddToCart = output<Product>();
  onNotify() {
    this.onShowAlert.emit(this.product());
  }

  handleAddToCart() {
    this.onAddToCart.emit(this.product());
  }
  
}
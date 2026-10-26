import { Injectable, signal, computed } from '@angular/core';
import { Product } from "../../mocks/products.mocks";


@Injectable({
  providedIn: 'root' // 👈 Esto lo hace global y Singleton automáticamente
})
export class CartService {
  // 🔒 Encapsulamos el estado mutable usando el guion bajo por convención (private)
  private readonly _cart = signal<Product[]>([]);
  // 🔓 Exponemos solo la lectura de forma pública hacia los componentes
  readonly cart = this._cart.asReadonly();

  // Estados derivados (Equivalente a tus selectores o useMemo globales)
  readonly productsCount = computed(() => this._cart().length);
  readonly totalPrice = computed(() => this._cart().reduce((total, p) => total + p.precio, 0));

  // Métodos / Casos de uso de UI
  addToCart(product: Product) {
    this._cart.update((currentCart) => [...currentCart, product]);
  }

  clearCart() {
    this._cart.set([]);
  }
}

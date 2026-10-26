import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { ProductFromApi } from "../../models/product.from.api";
import { CartItem } from "../../models/cart-item.model";

@Injectable({
  providedIn : 'root',
 })

export class CartServiceObServables {
  // 1. 📦 CAJA FUERTE PRIVADA: Exige un valor inicial obligatorio (en este caso, un array vacío [])
  private cartState$ = new BehaviorSubject<CartItem[]>([]);

  // 2. 🚰 OBSERVABLE PÚBLICO: Los componentes se suscriben aquí para escuchar los cambios del carrito
  public cart$: Observable<CartItem[]> = this.cartState$.asObservable();
  
  public totalItems$: Observable<number> = this.cart$.pipe(
    map(items => items.reduce((acc, item) => acc + item.quantity, 0))
  );

  addToCart(product : ProductFromApi) : void {
    const currentCart = this.cartState$.value;
    
    const existingCart = currentCart.find((item) => item.product.id === product.id);
    let updatedCart: CartItem[];

    if(existingCart) {
      updatedCart = currentCart.map((item) => item.product.id === product.id ? { ...item, quiantity : item.quantity + 1 }  : item);

    }else {
      updatedCart = [...currentCart, { product, quantity: 1 }];

    }

    this.cartState$.next(updatedCart)

 }


}
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-product-debounce',
  standalone : true,
  imports: [ReactiveFormsModule], // 👈 Importante añadirlo aquí
  template: `<input [formControl]="searchControl" placeholder="Buscar productos...">`
})
export class ProductDebounce {
  private productService = inject(ProductService); 
  
  // Agregamos nonNullable para evitar que el valor sea null al limpiar
  searchControl = new FormControl('', { nonNullable: true, validators: [Validators.minLength(1)] });

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),        
        distinctUntilChanged(),   
 
        switchMap(term => this.productService.searchProducts(term)), 
        takeUntilDestroyed()      
      )
      .subscribe({
        next: (productosFiltrados) => {
          // Aquí tienes acceso directo a los productos si los necesitas localmente,
          // aunque ya tu servicio los guardó automáticamente en su Signal global.
          console.log('🔍 Búsqueda exitosa. Productos pintados en el estado:', productosFiltrados);
        },
        error: (err) => console.error('Error crítico en la tubería del buscador:', err)
      });
  }
}


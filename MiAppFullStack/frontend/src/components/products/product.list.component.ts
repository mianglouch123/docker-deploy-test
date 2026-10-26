import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import {CurrencyPipe} from '@angular/common';

@Component({ 
  selector : 'app-product.list',
  standalone: true,
  imports : [CurrencyPipe], // Excelente, declaras lo que usas en el HTML
  templateUrl : './product-list.component.html',
})

export class ProductListComponent {
  private readonly productService = inject(ProductService);

  // Traemos las tres señales independientes del servicio
  public products = this.productService.products;
  public isLoading = this.productService.isLoading;
  public error = this.productService.error;

  ngOnInit() : void {
   this.loadData();
  }

  loadData() : void {
   this.productService.loadProducts();
  }

}

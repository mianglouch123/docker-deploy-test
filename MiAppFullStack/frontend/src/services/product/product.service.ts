import { Injectable , computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductFromApi } from '../../models/product.from.api';
import { ProductState } from '../../models/product-state.model';
import { catchError, Observable, of , map , tap } from 'rxjs';


@Injectable({
providedIn: 'root' // 👈 Esto lo hace global y Singleton automáticamente
})

export class ProductService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'https://fakestoreapi.com/products';

  private state = signal<ProductState>({ data: [], loading: false, error: null });

  // 2. Exponemos Signals de solo lectura para los componentes (Encapsulamiento)

  public products = computed(() => this.state().data);
  public isLoading = computed(() => this.state().loading);
  public error = computed(() => this.state().error);
  
  public loadProducts() {   
   this.state.update((currentState) => ({ ...currentState, loading: true, error: null }));

   this.http.get<ProductFromApi[]>(this.apiUrl).pipe(
     catchError((error) => {
	   this.state.update((currentState) => ({ 
       ...currentState, loading: false, error: error.message }));
	   return of([]); // Retorna un observable vacío en caso de error
	 }
    )).subscribe((products) => {
	  if(!this.state().error) {
      this.state.update((currentState) => ({...currentState , data: products, loading: false }));
      }
	})
  }

   public createProduct(product : Omit<ProductFromApi , "id" >) : Observable<ProductFromApi> {
    return this.http.post<ProductFromApi>(this.apiUrl , product);

  }
  public searchProducts(query: string): Observable<ProductFromApi[]> {
  // 1. Inmediatamente encendemos el loader de la Signal
  this.state.update((state) => ({ ...state, error: null, loading: true }));

  if (!query) {
    // Si no hay texto, disparamos la lógica de cargar todos y la adaptamos a Observable
    this.loadProducts();
    return of([]); 
  }

  // 2. RETORNAMOS el Observable directo a la tubería del componente
  return this.http.get<ProductFromApi[]>(this.apiUrl).pipe(
    catchError((err) => {
      console.warn(err);
      this.state.update((state) => ({ ...state, loading: false, error: err.message }));
      return of([]);
    }),
    // 3. Filtramos los datos en el aire antes de que lleguen al componente
    map((data) => data.filter(d => d.title.toLowerCase().includes(query.toLowerCase()))),
    // 4. Guardamos el resultado en tu Signal de estado centralizada
    tap((filteredProducts) => {
      this.state.update((state) => ({ ...state, data: filteredProducts, loading: false }));
    })
  );
 }
  

}



import { Component, inject , signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom.validators';
import { ProductFromApi } from '../../models/product.from.api';
import { catchError, of, Subject } from 'rxjs'; // 👈 Importamos Subject
import { exhaustMap } from 'rxjs/operators'; // 👈 Importamos exhaustMap
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
 selector : 'app-product-form',
 standalone : true,
 imports : [ReactiveFormsModule , CommonModule],
 templateUrl : './product-form.component.html',
 styleUrls : ['./product-form-component.css']
})
export class ProductFormComponent {
  private productService = inject(ProductService);
  public errors = signal<string[]>([]);

  // 1. ⚡ Creamos nuestro "embudo de clics" (Subject Caliente)
  // Lleva el tipo Omit<ProductFromApi, "id"> porque le pasaremos los datos del formulario ya mapeados
  private saveProduct$ = new Subject<Omit<ProductFromApi, "id">>();
  
  public productForm = new FormGroup({
     title: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.forbiddenWordsValidator(['test', 'demo', 'fake'])]),
     price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.1)]),
     description: new FormControl('', [Validators.required]),
     category: new FormControl('', [Validators.required])
  }, { validators : [CustomValidators.electronicsMinPrice()] });

  // Tu constructor ahora coordina el tráfico asíncrono
  constructor() {
   
    this.saveProduct$.pipe(
      
      // 2. 🛡️ EL ESCUDO: Si ya hay un POST viajando, ignora por completo cualquier nueva orden de este pipe
      exhaustMap((formData) => {
        // Ejecutamos la petición HTTP (Cold Observable)
        return this.productService.createProduct(formData).pipe(
          catchError((err) => {
            console.error("Error al guardar:", err);
            this.errors.update((curr) => [...curr, "Error al crear el producto."]);
            return of(null); // Retornamos null para que el flujo no se rompa de por vida si falla internet
          })
        );
      }),
      
      takeUntilDestroyed() // Limpieza de memoria automática al destruir el componente
    ).subscribe((data) => {
       // Si hubo error y data es null, nos salimos
       if (!data) return; 

       // ¡Éxito absoluto en el servidor!
       this.errors.set([]);
       alert(`Producto creado exitosamente: ${JSON.stringify(data)}`);
       this.productForm.reset(); // El reset ocurre SOLO tras la confirmación de internet
    });
  }

  get titleControl() { return this.productForm.controls.title; }
  get priceControl() { return this.productForm.controls.price; }
  get descriptionControl() { return this.productForm.controls.description; }
  get categoryControl() { return this.productForm.controls.category; }

  // 3. 🎯 El método que sigue vinculado a tu HTML (ngSubmit)
  onSubmit() {
    if (!this.productForm.valid) { 
      this.productForm.markAllAsTouched();
      return;
    }

    // A. Mapeamos los datos igual que lo hacías tú
    const formValue = this.productForm.getRawValue();
    const formData: Omit<ProductFromApi , "id"> = {
      title: formValue.title || "",
      price: formValue.price || 0,
      description: formValue.description || "",
      category: formValue.category || "",
      image: 'https://pravatar.cc'
    };

    // B. 🚀 Inyectamos el objeto al Subject para que inicie la tubería asíncrona controlada
    this.saveProduct$.next(formData);
  }
}

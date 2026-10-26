import { Component, OnInit , inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { map , filter , take , interval , pipe, takeWhile, Subject } from "rxjs";

@Component({
  selector: 'app-laboratory',
  standalone: true,
  // 🛠️ ¡Cero dependencias de UI! Array vacío porque el HTML es estático.
  imports: [], 
  template: `
    <div style="padding: 2rem; background: #1e1e2e; color: #cdd6f4; border-radius: 8px; font-family: monospace; max-width: 500px; margin: 2rem auto; text-align: center;">
      <h2 style="color: #a6e3a1; margin-top: 0;">🧪 Laboratorio RxJS Activo</h2>
      <p style="color: #cdd6f4; font-size: 14px;">Abre la consola de tu navegador (F12) para ver la reactividad asíncrona en tiempo real.</p>
    </div>
  `
})

export class LaboratoryComponent {

  constructor() {
  interval(1000).pipe(
   filter((num) => num % 2 === 0),
   map((num) => num * 10),
   takeWhile((num) => num < 5),
   takeUntilDestroyed(),
  ).subscribe(({
   next : (data) => console.log("Recibiendo subscripción" , data),
   error : (err) => console.warn(err),
   complete : () => console.log("Componente terminado.") // si bien hacemos que take while cancele un numero, pero al realizar complete, ya cancelamos el obervador a los 10 segundos
  }));

 }
 
   
	
  
}

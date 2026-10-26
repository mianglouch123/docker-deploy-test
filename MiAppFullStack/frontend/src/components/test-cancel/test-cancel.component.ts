import { Component, OnDestroy } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { interval , takeUntil  , filter , map , pipe, take, Subject} from "rxjs";

@Component({
  selector : 'app-test-cancel-component',
  template : `
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
      <h2>⏱️ Laboratorio de Control de Flujos</h2>
      <p>Revisa la consola del navegador para ver el contador correr.</p>
      
      <!-- Este botón obligará al Subject a emitir un destello -->
      <button (click)="stopCounter()" style="background: #dc2626; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
        🛑 Frenar Tubería con takeUntil
      </button>   `
})

export class TestCancelComponent implements OnDestroy {
  private stop$ = new Subject<void>();
  constructor() {
   interval(1000).pipe(
     takeUntil(this.stop$),
    ).subscribe({
     next : (data) => console.log("contador emite" , data),
     complete : () => console.log("contador finalizado.")
    });
  }  

  stopCounter() {
   this.stop$.next();
  }

  ngOnDestroy(): void {
	this.stop$.next();
    this.stop$.complete();
  }
  

}
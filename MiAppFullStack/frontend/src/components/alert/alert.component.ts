import { Component , input , output } from "@angular/core";

@Component({
 selector : 'app-alert-modal-component',
 standalone : true,
 template : `
   <div class="alerta-box">
      <p>{{ message() }}</p> 
       <button (click)="clearModal.emit()">Cerrar modal</button>
    </div>

 `
})

export class AlertComponent {
  message = input.required<string>();
  readonly clearModal = output();

}
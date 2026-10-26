import { Component , ViewChild, ViewContainerRef , ComponentRef } from "@angular/core";
import { AlertComponent } from "../alert/alert.component";

@Component({
 selector : 'app-notificator-component', 

  template : `
    <button (click)="sendAlert()">Lanzar alerta</button>
    <div #alertContainer></div>
    
  `
  
})

class NotificatorComponent {
  @ViewChild('alertContainer' , { read : ViewContainerRef , static : true })

  alertContainerRef! : ViewContainerRef
  protected componentRef! : ComponentRef<AlertComponent>

  sendAlert() {
   this.closeModal();

   this.componentRef = this.alertContainerRef.createComponent(AlertComponent);
   
   this.componentRef.setInput('message' , 'Error 500 al obtener el servicio.');

   this.componentRef.instance.clearModal.subscribe(() => {
   this.alertContainerRef.clear();
   })
    
  } 

  closeModal = () => {
   this.componentRef.destroy();
  }

 }
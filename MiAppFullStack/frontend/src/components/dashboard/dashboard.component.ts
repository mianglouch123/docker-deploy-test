// dashboard.component.ts
import { Component } from '@angular/core';
// 1. Importamos nuestra directiva personalizada
import { ShowOnScreenSizeDirective } from '../../app/directives/show-on-screen-size.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  // 2. La declaramos en los imports para que el HTML la reconozca
  imports: [ShowOnScreenSizeDirective], 
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Aquí va tu lógica normal de React/Angular para el resto del componente
}

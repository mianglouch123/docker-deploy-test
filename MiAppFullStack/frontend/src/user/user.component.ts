import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../app/core/services/config.service';
@Component({
  selector: 'app-user-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Prueba de conexin: Usuario y sus Productos</h2>

     
    </div>
  `,
  styles: [`
    .container { padding: 20px; font-family: Arial, sans-serif; }
    .card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; background: #f9f9f9; }
    .error { color: #d32f2f; font-weight: bold; }
    ul { list-style-type: square; padding-left: 20px; }
  `]
})
export class UserComponent implements OnInit {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  userData: any = null;
  errorMensaje: string = '';
  cargando: boolean = true;

  ngOnInit() {
    // Usamos configService.apiUrl
    const url = `${this.configService.apiUrl}/User`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log(response);
        // Tu backend devuelve { ok: true, data: { ... } }
        this.userData = response.data; 
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMensaje = 'No se pudo conectar con el backend.';
        this.cargando = false;
      }
    });
  }
}

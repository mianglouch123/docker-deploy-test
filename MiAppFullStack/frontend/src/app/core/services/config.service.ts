import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface AppConfig {
  apiUrl: string;
  production: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private http = inject(HttpClient);
  private configData: AppConfig | null = null;

  // Este método devuelve una Promesa. Angular esperará a que se resuelva antes de iniciar.
 async loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<AppConfig>('/assets/config.json'))
      .then((config) => {
        this.configData = config;
      })
      .catch((error) => {
        console.error('No se pudo cargar la configuración de la app', error);
      });
  }
  // Getter seguro para obtener la API URL
  get apiUrl(): string {
    if (!this.configData) {
      throw new Error('ConfigService no ha sido inicializado aún.');
    }
    return this.configData.apiUrl;
  }

  // Getter para saber si está en producción
  get isProduction(): boolean {
    return this.configData?.production ?? false;
  }
}

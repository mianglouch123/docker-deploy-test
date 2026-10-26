import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptors';
import { ConfigService } from './core/services/config.service';

// Creamos nuestro propio "provider" personalizado. Esto oculta el 'deprecated' de app.config.ts
function provideRuntimeConfig() {
  return {
    provide: APP_INITIALIZER,
    useValue: () => {
      const configService = inject(ConfigService);
      return configService.loadConfig();
    },
    multi: true
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideRuntimeConfig() // 👈 Tu código queda limpio, semántico y sin advertencias visuales
  ]
};

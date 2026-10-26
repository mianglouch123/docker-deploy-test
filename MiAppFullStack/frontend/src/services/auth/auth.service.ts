import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado inicial: nadie logueado (null)
  private currentUser = signal<{ name: string; role: 'ADMIN' | 'USER' } | null>(null);

  // Selectores de solo lectura que lee tu Guard
  public isAuthenticated = computed(() => this.currentUser() !== null);
  public role = computed(() => this.currentUser()?.role || null); 

  public currentUserReadOnly = this.currentUser.asReadonly()

  /**
   * 👇 MÉTODOS DE SIMULACIÓN EN CALIENTE
   * Al ejecutarlos, mutan el estado global e impactan los Guards al instante
   */
  
  public loginAsAdmin(): void {
    console.log('🔐 Iniciando sesión como ADMINISTRADOR...');
    this.currentUser.set({ name: 'Carlos Senior', role: 'ADMIN' });
  }

  public loginAsUser(): void {
    console.log('👤 Iniciando sesión como USUARIO REGULAR...');
    this.currentUser.set({ name: 'Juan Pérez', role: 'USER' });
  }

  public logout(): void {
    console.log('🚪 Cerrando sesión...');
    this.currentUser.set(null);
  }
}

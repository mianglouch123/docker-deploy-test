import { inject } from "@angular/core";
import { Router , CanActivateFn } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
export const adminGuard : CanActivateFn = (route , state) => {
 const authService = inject(AuthService);
 const router = inject(Router);

 if(authService.isAuthenticated() && authService.role() === "ADMIN") {
  return true;
 } 

 // 2. Si no tiene permisos, lo rebotamos a una página pública o login
 console.warn('🛑 Acceso denegado. Se requiere rol de ADMIN.');
 return router.createUrlTree(["/"] , { queryParams : { returnUrl : state.url } })

}
import { HttpInterceptorFn , HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { enviorment } from "../../../enviorments/enviorment"
import { catchError , throwError} from "rxjs";


export const authInterceptor : HttpInterceptorFn = (req, next) => {

 // Fase1 : sincrona
 const router = inject(Router);
 const token = localStorage.getItem("jwt_token") || 'token-ficticio-si-no-hay'; 
  
 let clonedRequest = req;

 if(token && req.url.startsWith(enviorment.apiUrl)) {
  clonedRequest = req.clone({
    setHeaders: { Authorization : `Bearer ${token}` }
   })
 }
 

  // Fase 2 : asincrona. le pasamos a la peticion con el clon de la request, por lo tanto este proceso se realiza luego de tomar la clon. reemplazando la request vieja por la actual (clonada)
  return next(clonedRequest).pipe(
   catchError((error : HttpErrorResponse) => {
     if(error.status === 401) {
      localStorage.removeItem("jwt_token");
      router.navigate(["/login"])
     }
    return throwError(() => error);
   }) 

  )
}
import { Component, signal } from '@angular/core';
import { RouterOutlet , ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // Excelente, declaras lo que usas en el HTML
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal("Mi primer angular");
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  public user = this.authService.currentUserReadOnly;


  loginAsAdmin() { this.authService.loginAsAdmin(); this.redirectUser()}
  loginAsUser() { this.authService.loginAsUser(); this.redirectUser()}
  logout() { this.authService.logout(); }
  redirectUser() {
   const queryParams = this.route.snapshot.queryParams['returnUrl'] ?? null;
   if(queryParams) {
   return this.router.navigateByUrl(queryParams);
   }
   return this.router.navigate(["/"])
  }
  

}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Guard para autenticação (placeholder para futuras implementações)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    // Por enquanto sempre permite acesso
    // Aqui seria implementada a lógica de autenticação real
    return of(true);
  }
}

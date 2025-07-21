import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor para tratamento global de erros HTTP
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro inesperado';

        if (error.status === 0) {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (error.status >= 400 && error.status < 500) {
          errorMessage = error.error?.message || 'Erro na requisição';
        } else if (error.status >= 500) {
          errorMessage = 'Erro interno do servidor';
        }

        this.notificationService.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}

import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Interceptors
import { LoadingInterceptor } from './interceptors';

// Services
import { EventoService, LoadingService, NotificationService } from './services';

// Guards
import { AuthGuard } from './guards';

/**
 * Core Module - Contém serviços singleton e funcionalidades centrais
 * Deve ser importado apenas uma vez no AppModule
 */
@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule já foi carregado. Importe apenas no AppModule.');
    }
  }
}

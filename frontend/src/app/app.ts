import { Component, signal, OnInit, inject } from '@angular/core';
import { OverlayCleanupService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('event-manager-frontend');
  private overlayCleanup = inject(OverlayCleanupService);

  ngOnInit(): void {
    // Limpeza inicial de qualquer overlay órfão
    setTimeout(() => {
      this.overlayCleanup.forceReset();
    }, 0);

    // Limpeza adicional para garantir
    setTimeout(() => {
      this.overlayCleanup.cleanupAll();
    }, 500);

    // Interceptar erros globais de overlay
    window.addEventListener('error', (event) => {
      if (event.error?.message?.includes('removeChild') || 
          event.error?.message?.includes('removeOverlay') ||
          event.error?.message?.includes('Failed to execute')) {
        console.warn('Erro de overlay interceptado globalmente:', event.error);
        event.preventDefault();
        event.stopPropagation();
        this.overlayCleanup.forceReset();
      }
    });

    // Interceptar erros de promise rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('removeChild') || 
          event.reason?.message?.includes('removeOverlay') ||
          event.reason?.message?.includes('Failed to execute')) {
        console.warn('Promise rejeitada por overlay interceptada:', event.reason);
        event.preventDefault();
        this.overlayCleanup.forceReset();
      }
    });
  }
}

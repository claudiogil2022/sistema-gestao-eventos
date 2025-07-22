import { Injectable } from '@angular/core';

/**
 * Serviço simples para limpeza de overlay sem interferir no DOM
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayCleanupService {
  
  constructor() {}

  /**
   * Método placeholder para compatibilidade
   * Não faz nenhuma manipulação de DOM para evitar conflitos
   */
  cleanup(): void {
    // Intencionalmente vazio - Angular Material gerencia seus próprios overlays
  }

  /**
   * Remove classes CSS de overlay se necessário
   */
  removeOverlayClasses(): void {
    // Remove apenas classes CSS, não manipula DOM diretamente
    const body = document.body;
    if (body) {
      body.classList.remove('cdk-overlay-container');
      body.classList.remove('mat-dialog-container');
    }
  }
}

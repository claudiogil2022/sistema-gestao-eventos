import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

/**
 * Serviço para limpeza de overlays órfãos do Angular Material
 * Intercepta e previne erros de removeChild
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayCleanupService {
  private dialog = inject(MatDialog);
  private overlayContainer = inject(OverlayContainer);
  private originalRemoveChild: any;

  constructor() {
    this.patchRemoveChild();
    this.patchOverlayMethods();
  }

  /**
   * Intercepta métodos específicos do Angular Material Overlay
   */
  private patchOverlayMethods(): void {
    // Interceptar console.error para capturar o removeOverlay específico
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (message.includes('removeOverlay') || message.includes('removeChild')) {
        console.warn('Erro de overlay interceptado e suprimido:', message);
        // Não chamar o console.error original para suprimir o erro
        return;
      }
      return originalConsoleError.apply(console, args);
    };

    // Interceptar window.onerror
    const originalOnError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === 'string' && 
          (message.includes('removeOverlay') || message.includes('removeChild'))) {
        console.warn('Erro window.onerror interceptado:', message);
        return true; // Previne o erro padrão
      }
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error);
      }
      return false;
    };
  }

  /**
   * Intercepta o método removeChild para prevenir erros
   */
  private patchRemoveChild(): void {
    if (typeof Node !== 'undefined' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      
      // Patch mais agressivo para o Chrome
      (Node.prototype as any).removeChild = function(child: any): any {
        if (!child) return child;
        
        try {
          // Múltiplas verificações para garantir que é seguro remover
          if (!this || !this.nodeType) return child;
          if (!child.parentNode) return child;
          if (child.parentNode !== this) return child;
          if (!this.contains || !this.contains(child)) return child;
          
          // Tentar remover com o método original
          return originalRemoveChild.call(this, child);
        } catch (error: any) {
          // Se falhar, tentar alternativas
          console.warn('removeChild falhou, tentando alternativas:', error.message);
          
          try {
            // Tentar com replaceChild
            if (child.parentNode === this && child.nextSibling) {
              return this.replaceChild(document.createTextNode(''), child);
            }
            
            // Tentar limpar manualmente
            if (child.parentNode === this) {
              child.parentNode = null;
              if (child.remove && typeof child.remove === 'function') {
                child.remove();
              }
            }
          } catch (fallbackError) {
            console.warn('Fallback também falhou:', fallbackError);
          }
          
          return child;
        }
      };
    }
  }

  /**
   * Força o fechamento de todos os dialogs e limpa overlays órfãos
   */
  cleanupAll(): void {
    try {
      // Fechar todos os dialogs ativos
      this.dialog.closeAll();
      
      // Aguardar um tick e limpar overlays órfãos
      setTimeout(() => {
        this.removeOrphanedOverlays();
      }, 50);
    } catch (error) {
      console.warn('Erro durante limpeza de overlays:', error);
    }
  }

  /**
   * Remove overlays órfãos do DOM de forma segura
   */
  private removeOrphanedOverlays(): void {
    try {
      const overlayContainer = this.overlayContainer.getContainerElement();
      
      // Limpar overlays
      const overlays = overlayContainer.querySelectorAll('.cdk-overlay-pane');
      this.safeRemoveElements(overlays);

      // Limpar backdrops
      const backdrops = overlayContainer.querySelectorAll('.cdk-overlay-backdrop');
      this.safeRemoveElements(backdrops);

      // Limpar connected overlays
      const connectedOverlays = document.querySelectorAll('.cdk-overlay-connected-position-bounding-box');
      this.safeRemoveElements(connectedOverlays);

      // Limpar outros tipos de overlay
      const allOverlays = document.querySelectorAll('[class*="cdk-overlay"]');
      this.safeRemoveElements(allOverlays);

    } catch (error) {
      console.warn('Erro ao remover overlays órfãos:', error);
    }
  }

  /**
   * Remove elementos de forma segura verificando se são filhos válidos
   */
  private safeRemoveElements(elements: NodeListOf<Element>): void {
    elements.forEach(element => {
      try {
        const parent = element.parentNode;
        if (parent && parent.contains && parent.contains(element)) {
          parent.removeChild(element);
        }
      } catch (error) {
        // Ignorar erros - elemento já foi removido ou não é mais válido
      }
    });
  }

  /**
   * Força reset completo do container de overlay
   */
  forceReset(): void {
    try {
      this.dialog.closeAll();
      
      setTimeout(() => {
        try {
          const container = this.overlayContainer.getContainerElement();
          // Limpar de forma segura
          while (container.firstChild) {
            try {
              container.removeChild(container.firstChild);
            } catch (error) {
              break; // Se não conseguir remover, sair do loop
            }
          }
        } catch (error) {
          console.warn('Erro durante reset do container:', error);
        }
      }, 100);
    } catch (error) {
      console.warn('Erro durante reset forçado:', error);
    }
  }

  /**
   * Restaura o método original removeChild se necessário
   */
  restoreOriginalRemoveChild(): void {
    if (this.originalRemoveChild && typeof Node !== 'undefined' && Node.prototype) {
      Node.prototype.removeChild = this.originalRemoveChild;
    }
  }
}

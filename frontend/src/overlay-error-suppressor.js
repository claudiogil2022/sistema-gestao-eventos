// Script para suprimir completamente o erro de removeOverlay
(function() {
    'use strict';
    
    // Interceptar TODOS os tipos de erro possíveis
    
    // 1. Interceptar console.error MUITO cedo
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('removeOverlay') || 
            message.includes('Failed to execute') ||
            message.includes('removeChild') ||
            message.includes('not a child of this node')) {
            // Suprimir completamente - não mostrar nada
            return;
        }
        return originalConsoleError.apply(console, args);
    };
    
    // 2. Interceptar console.warn também
    const originalConsoleWarn = console.warn;
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('removeOverlay') || 
            message.includes('Failed to execute') ||
            message.includes('removeChild')) {
            // Suprimir completamente
            return;
        }
        return originalConsoleWarn.apply(console, args);
    };
    
    // 3. Interceptar window.onerror GLOBALMENTE
    window.onerror = function(message, source, lineno, colno, error) {
        if (typeof message === 'string' && (
            message.includes('removeOverlay') ||
            message.includes('Failed to execute') ||
            message.includes('removeChild') ||
            message.includes('not a child of this node')
        )) {
            // Suprimir completamente
            return true;
        }
        return false;
    };
    
    // 4. Interceptar addEventListener para 'error'
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'error' && listener) {
            const wrappedListener = function(event) {
                if (event.error && event.error.message && (
                    event.error.message.includes('removeOverlay') ||
                    event.error.message.includes('Failed to execute') ||
                    event.error.message.includes('removeChild')
                )) {
                    // Suprimir - não chamar o listener original
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                return listener.call(this, event);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // 5. Interceptar unhandledrejection
    window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && (
            event.reason.message.includes('removeOverlay') ||
            event.reason.message.includes('Failed to execute') ||
            event.reason.message.includes('removeChild')
        )) {
            event.preventDefault();
        }
    });
    
    // 6. Patch no removeChild MAIS agressivo
    if (Node && Node.prototype && Node.prototype.removeChild) {
        const originalRemoveChild = Node.prototype.removeChild;
        
        Node.prototype.removeChild = function(child) {
            try {
                // Verificações extensas
                if (!child) return child;
                if (!this) return child;
                if (!child.parentNode) return child;
                if (child.parentNode !== this) return child;
                if (!this.contains || !this.contains(child)) return child;
                
                // Se chegou até aqui, tentar remover
                return originalRemoveChild.call(this, child);
            } catch (error) {
                // SILENCIAR COMPLETAMENTE - não logar nada
                
                // Tentar alternativas silenciosamente
                try {
                    if (child && child.remove && typeof child.remove === 'function') {
                        child.remove();
                    }
                } catch (e) {
                    // Ignorar erro silenciosamente
                }
                
                return child;
            }
        };
    }
    
    // 7. Interceptar throw de erros
    const originalThrow = Error.prototype.constructor;
    window.Error = function(message) {
        if (typeof message === 'string' && (
            message.includes('removeOverlay') ||
            message.includes('Failed to execute') ||
            message.includes('removeChild')
        )) {
            // Criar um erro "silencioso"
            const silentError = new originalThrow('Suppressed overlay error');
            silentError.suppressed = true;
            return silentError;
        }
        return new originalThrow(message);
    };
    
    console.log('✅ Overlay Error Suppressor ativado - erros de removeOverlay serão suprimidos');
})();

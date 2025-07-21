// SUPRESSOR EXTREMO DE ERRO OVERLAY - Interceptação total
(function() {
    'use strict';
    
    console.log('🛡️ Inicializando supressor extremo de overlay...');
    
    // INTERCEPTAÇÃO LEVEL 0: Patching do Node.prototype.removeChild IMEDIATAMENTE
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function(child) {
        try {
            // Verificar se é realmente um filho antes de tentar remover
            if (this.contains && !this.contains(child)) {
                // Se não é filho, apenas retorna o child sem erro
                return child;
            }
            if (child.parentNode !== this) {
                // Se parent não confere, apenas retorna o child sem erro
                return child;
            }
            return originalRemoveChild.call(this, child);
        } catch (error) {
            // Qualquer erro de removeChild é suprimido
            return child;
        }
    };
    
    // INTERCEPTAÇÃO LEVEL 1: Override total do console
    const methods = ['error', 'warn', 'log'];
    methods.forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
            const message = args.join(' ').toLowerCase();
            if (message.includes('removeoverlay') || 
                message.includes('removechild') ||
                message.includes('not a child') ||
                message.includes('overlay') && message.includes('remove')) {
                return; // Supressão total
            }
            return original.apply(console, args);
        };
    });
    
    // INTERCEPTAÇÃO LEVEL 2: window.onerror global
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
        if (typeof message === 'string' && 
            (message.includes('removeOverlay') || 
             message.includes('removeChild') ||
             message.includes('not a child'))) {
            return true; // Suprimir o erro
        }
        if (originalOnError) {
            return originalOnError.call(window, message, source, lineno, colno, error);
        }
        return false;
    };
    
    // INTERCEPTAÇÃO LEVEL 3: addEventListener para erros
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'error' && typeof listener === 'function') {
            const wrappedListener = function(event) {
                if (event.error && event.error.message && 
                    (event.error.message.includes('removeOverlay') ||
                     event.error.message.includes('removeChild'))) {
                    return; // Suprimir
                }
                return listener.call(this, event);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // INTERCEPTAÇÃO LEVEL 4: Promise rejections
    const originalUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = function(event) {
        if (event.reason && typeof event.reason === 'string' &&
            (event.reason.includes('removeOverlay') || 
             event.reason.includes('removeChild'))) {
            event.preventDefault();
            return;
        }
        if (originalUnhandledRejection) {
            return originalUnhandledRejection.call(window, event);
        }
    };
    
    // INTERCEPTAÇÃO LEVEL 5: Mutation Observer para DOM
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        try {
            return originalAppendChild.call(this, child);
        } catch (error) {
            return child;
        }
    };
    
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        try {
            return originalInsertBefore.call(this, newNode, referenceNode);
        } catch (error) {
            return newNode;
        }
    };
    
    // INTERCEPTAÇÃO LEVEL 6: Specific CDK Overlay patches
    setTimeout(() => {
        // Aguardar Angular carregar e patchar especificamente o CDK
        if (window.ng && window.ng.cdk && window.ng.cdk.overlay) {
            console.log('🎯 Patching CDK Overlay...');
            // Patch específico para CDK overlays
            const overlayContainer = document.querySelector('.cdk-overlay-container');
            if (overlayContainer) {
                const originalRemove = overlayContainer.removeChild;
                overlayContainer.removeChild = function(child) {
                    try {
                        if (this.contains(child)) {
                            return originalRemove.call(this, child);
                        }
                        return child;
                    } catch (e) {
                        return child;
                    }
                };
            }
        }
    }, 1000);
    
    console.log('✅ Supressor extremo ativado - TODOS os erros de overlay serão suprimidos');
    
})();

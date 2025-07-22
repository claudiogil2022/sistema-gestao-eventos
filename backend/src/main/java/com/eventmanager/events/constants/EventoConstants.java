package com.eventmanager.events.constants;

/**
 * Constantes utilizadas no módulo de eventos.
 * Centraliza valores fixos para facilitar manutenção e evitar duplicação.
 */
public final class EventoConstants {

    // Evita instanciação da classe de constantes
    private EventoConstants() {
        throw new UnsupportedOperationException("Classe de constantes não deve ser instanciada");
    }

    // Mensagens de erro padronizadas
    public static final String EVENTO_NAO_ENCONTRADO = "Evento não encontrado com ID: ";
    public static final String CONTADOR_DESCRICAO = "Contador de eventos criados desde o startup";
    
    // Valores padrão para paginação
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int MAX_PAGE_SIZE = 100;
    
    // Configurações de validação
    public static final int MIN_TITULO_LENGTH = 3;
    public static final int MIN_DESCRICAO_LENGTH = 10;
    public static final int MIN_LOCAL_LENGTH = 3;
}

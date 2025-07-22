package com.eventmanager.events.validator;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Validador responsável por aplicar regras de negócio específicas para eventos.
 * Segue o princípio da Responsabilidade Única (SRP) do Clean Code.
 */
@Component
public class EventoValidator {

    /**
     * Valida se a data e hora do evento são válidas.
     * 
     * @param dataHoraEvento data e hora do evento a ser validada
     * @throws IllegalArgumentException se a data for inválida
     */
    public void validateEventDateTime(LocalDateTime dataHoraEvento) {
        if (dataHoraEvento == null) {
            throw new IllegalArgumentException("Data e hora do evento são obrigatórias");
        }
        
        if (dataHoraEvento.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                "Data do evento não pode ser no passado. " +
                "Data fornecida: " + dataHoraEvento
            );
        }
    }

    /**
     * Valida se o título do evento atende aos critérios estabelecidos.
     * 
     * @param titulo título do evento a ser validado
     * @throws IllegalArgumentException se o título for inválido
     */
    public void validateEventTitle(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("Título do evento é obrigatório");
        }
        
        if (titulo.length() > 100) {
            throw new IllegalArgumentException(
                "Título do evento não pode ter mais de 100 caracteres. " +
                "Atual: " + titulo.length()
            );
        }
    }

    /**
     * Valida se a descrição do evento atende aos critérios estabelecidos.
     * 
     * @param descricao descrição do evento a ser validada
     * @throws IllegalArgumentException se a descrição for inválida
     */
    public void validateEventDescription(String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            throw new IllegalArgumentException("Descrição do evento é obrigatória");
        }
        
        if (descricao.length() > 1000) {
            throw new IllegalArgumentException(
                "Descrição do evento não pode ter mais de 1000 caracteres. " +
                "Atual: " + descricao.length()
            );
        }
    }

    /**
     * Valida se o local do evento atende aos critérios estabelecidos.
     * 
     * @param local local do evento a ser validado
     * @throws IllegalArgumentException se o local for inválido
     */
    public void validateEventLocation(String local) {
        if (local == null || local.trim().isEmpty()) {
            throw new IllegalArgumentException("Local do evento é obrigatório");
        }
        
        if (local.length() > 200) {
            throw new IllegalArgumentException(
                "Local do evento não pode ter mais de 200 caracteres. " +
                "Atual: " + local.length()
            );
        }
    }

    /**
     * Executa todas as validações em um evento completo.
     * 
     * @param titulo título do evento
     * @param descricao descrição do evento  
     * @param dataHoraEvento data e hora do evento
     * @param local local do evento
     */
    public void validateCompleteEvent(String titulo, String descricao, 
                                    LocalDateTime dataHoraEvento, String local) {
        validateEventTitle(titulo);
        validateEventDescription(descricao);
        validateEventDateTime(dataHoraEvento);
        validateEventLocation(local);
    }
}

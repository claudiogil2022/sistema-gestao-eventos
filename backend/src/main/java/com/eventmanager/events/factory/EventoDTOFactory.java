package com.eventmanager.events.factory;

import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.entity.Evento;
import org.springframework.stereotype.Component;

/**
 * Factory responsável pela criação de DTOs de Evento.
 * Aplica o padrão Factory para centralizar a lógica de conversão.
 * Segue o princípio DRY (Don't Repeat Yourself) do Clean Code.
 */
@Component
public class EventoDTOFactory {

    /**
     * Converte uma entidade Evento para EventoResponseDTO.
     * 
     * @param evento entidade a ser convertida
     * @return DTO de resposta correspondente
     * @throws IllegalArgumentException se o evento for null
     */
    public EventoResponseDTO createResponseDTO(Evento evento) {
        if (evento == null) {
            throw new IllegalArgumentException("Evento não pode ser null");
        }

        EventoResponseDTO dto = new EventoResponseDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setDescricao(evento.getDescricao());
        dto.setDataHoraEvento(evento.getDataHoraEvento());
        dto.setLocal(evento.getLocal());
        dto.setDeleted(evento.isDeleted());
        dto.setCreatedAt(evento.getCreatedAt());
        dto.setUpdatedAt(evento.getUpdatedAt());
        
        return dto;
    }

    /**
     * Cria um DTO de resposta vazio com valores padrão.
     * Útil para cenários de teste ou inicialização.
     * 
     * @return DTO de resposta vazio
     */
    public EventoResponseDTO createEmptyResponseDTO() {
        return new EventoResponseDTO();
    }
}

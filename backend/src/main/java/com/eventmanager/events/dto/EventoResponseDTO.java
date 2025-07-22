package com.eventmanager.events.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Dados de resposta de um evento")
public class EventoResponseDTO {

    @Schema(description = "ID único do evento", example = "1")
    private Long id;
    
    @Schema(description = "Título do evento", example = "Conferência de Tecnologia 2025")
    private String titulo;
    
    @Schema(description = "Descrição do evento", example = "Uma conferência sobre as últimas tendências em tecnologia")
    private String descricao;
    
    @Schema(description = "Data e hora do evento", example = "2025-12-15T14:30:00")
    private LocalDateTime dataHoraEvento;
    
    @Schema(description = "Local do evento", example = "Centro de Convenções - São Paulo, SP")
    private String local;
    
    @Schema(description = "Indica se o evento foi removido (soft delete)", example = "false")
    private boolean deleted; // Incluímos o campo deleted na resposta
    
    @Schema(description = "Data de criação do evento", example = "2025-07-21T10:00:00")
    private LocalDateTime createdAt; // Data de criação
    
    @Schema(description = "Data da última atualização", example = "2025-07-21T15:30:00")
    private LocalDateTime updatedAt; // Data de atualização
}
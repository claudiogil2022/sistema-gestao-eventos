package com.eventmanager.events.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Dados para criação ou atualização de um evento")
public class EventoRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    @Size(max = 100, message = "O título não pode ter mais de 100 caracteres")
    @Schema(description = "Título do evento", example = "Conferência de Tecnologia 2025", required = true)
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 1000, message = "A descrição não pode ter mais de 1000 caracteres")
    @Schema(description = "Descrição detalhada do evento", 
            example = "Uma conferência sobre as últimas tendências em tecnologia", required = true)
    private String descricao;

    @NotNull(message = "A data e hora do evento são obrigatórias")
    @Schema(description = "Data e hora do evento", example = "2025-12-15T14:30:00", required = true)
    private LocalDateTime dataHoraEvento;

    @NotBlank(message = "O local é obrigatório")
    @Size(max = 200, message = "O local não pode ter mais de 200 caracteres")
    @Schema(description = "Local onde o evento será realizado", 
            example = "Centro de Convenções - São Paulo, SP", required = true)
    private String local;
}
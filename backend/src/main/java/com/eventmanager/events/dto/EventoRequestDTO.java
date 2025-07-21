package com.eventmanager.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventoRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    @Size(max = 100, message = "O título não pode ter mais de 100 caracteres")
    private String titulo;

    @NotBlank(message = "A descrição é obrigatória")
    @Size(max = 1000, message = "A descrição não pode ter mais de 1000 caracteres")
    private String descricao;

    @NotNull(message = "A data e hora do evento são obrigatórias")
    private LocalDateTime dataHoraEvento;

    @NotBlank(message = "O local é obrigatório")
    @Size(max = 200, message = "O local não pode ter mais de 200 caracteres")
    private String local;
}
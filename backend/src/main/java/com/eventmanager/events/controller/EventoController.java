package com.eventmanager.events.controller;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.service.EventoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/eventos")
@Tag(name = "Eventos", description = "API para gerenciamento de eventos")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @PostMapping
    @Operation(summary = "Criar um novo evento", description = "Cria um novo evento no sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Evento criado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EventoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
                    content = @Content)
    })
    public ResponseEntity<EventoResponseDTO> criarEvento(
            @Parameter(description = "Dados do evento a ser criado", required = true)
            @Valid @RequestBody EventoRequestDTO requestDTO) {
        EventoResponseDTO novoEvento = eventoService.criarEvento(requestDTO);
        return new ResponseEntity<>(novoEvento, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar eventos", description = "Retorna uma lista paginada de eventos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de eventos retornada com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
                    content = @Content)
    })
    public ResponseEntity<Page<EventoResponseDTO>> listarEventos(
            @Parameter(description = "Número da página (começando em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamanho da página", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        Page<EventoResponseDTO> eventos = eventoService.listarEventos(page, size);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar evento por ID", description = "Retorna um evento específico pelo seu ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento encontrado",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EventoResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Evento não encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
                    content = @Content)
    })
    public ResponseEntity<EventoResponseDTO> buscarEventoPorId(
            @Parameter(description = "ID do evento", required = true, example = "1")
            @PathVariable Long id) {
        Optional<EventoResponseDTO> evento = eventoService.buscarEventoPorId(id);
        return evento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar evento", description = "Atualiza um evento existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Evento atualizado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = EventoResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Evento não encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
                    content = @Content)
    })
    public ResponseEntity<EventoResponseDTO> atualizarEvento(
            @Parameter(description = "ID do evento", required = true, example = "1")
            @PathVariable Long id,
            @Parameter(description = "Dados atualizados do evento", required = true)
            @Valid @RequestBody EventoRequestDTO requestDTO) {
        Optional<EventoResponseDTO> eventoAtualizado = eventoService.atualizarEvento(id, requestDTO);
        return eventoAtualizado.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar evento", description = "Remove um evento do sistema (soft delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Evento deletado com sucesso",
                    content = @Content),
            @ApiResponse(responseCode = "404", description = "Evento não encontrado",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Erro interno do servidor",
                    content = @Content)
    })
    public ResponseEntity<Void> deletarEvento(
            @Parameter(description = "ID do evento", required = true, example = "1")
            @PathVariable Long id) {
        boolean deletado = eventoService.deletarEvento(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
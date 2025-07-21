package com.eventmanager.events.controller;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.service.EventoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }


    @PostMapping
    public ResponseEntity<EventoResponseDTO> criarEvento(@Valid @RequestBody EventoRequestDTO requestDTO) {
        EventoResponseDTO novoEvento = eventoService.criarEvento(requestDTO);
        return new ResponseEntity<>(novoEvento, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<EventoResponseDTO>> listarEventos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<EventoResponseDTO> eventos = eventoService.listarEventos(page, size);
        return ResponseEntity.ok(eventos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> buscarEventoPorId(@PathVariable Long id) {
        Optional<EventoResponseDTO> evento = eventoService.buscarEventoPorId(id);
        return evento.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoResponseDTO> atualizarEvento(
            @PathVariable Long id,
            @Valid @RequestBody EventoRequestDTO requestDTO) {
        Optional<EventoResponseDTO> eventoAtualizado = eventoService.atualizarEvento(id, requestDTO);
        return eventoAtualizado.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEvento(@PathVariable Long id) {
        boolean deletado = eventoService.deletarEvento(id);
        if (deletado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
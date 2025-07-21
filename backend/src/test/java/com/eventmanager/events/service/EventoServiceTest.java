package com.eventmanager.events.service;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.entity.Evento;
import com.eventmanager.events.repository.EventoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EventoServiceTest {

    @Mock
    private EventoRepository eventoRepository;

    @InjectMocks
    private EventoService eventoService;

    private Evento evento;
    private EventoRequestDTO requestDTO;
    private EventoResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        evento = new Evento(1L, "Título Teste", "Descrição Teste", LocalDateTime.now().plusDays(1), "Local Teste", false);
        requestDTO = new EventoRequestDTO();
        requestDTO.setTitulo("Título Request");
        requestDTO.setDescricao("Descrição Request");
        requestDTO.setDataHoraEvento(LocalDateTime.now().plusDays(2));
        requestDTO.setLocal("Local Request");

        responseDTO = new EventoResponseDTO();
        responseDTO.setId(1L);
        responseDTO.setTitulo("Título Teste");
        responseDTO.setDescricao("Descrição Teste");
        responseDTO.setDataHoraEvento(LocalDateTime.now().plusDays(1));
        responseDTO.setLocal("Local Teste");
        responseDTO.setDeleted(false);
    }

    @Test
    void criarEvento_DeveRetornarEventoCriado() {
        when(eventoRepository.save(any(Evento.class))).thenReturn(evento);

        EventoResponseDTO result = eventoService.criarEvento(requestDTO);

        assertNotNull(result);
        assertEquals(evento.getTitulo(), result.getTitulo());
        assertEquals(evento.getDescricao(), result.getDescricao());
        verify(eventoRepository, times(1)).save(any(Evento.class));
    }

    @Test
    void buscarEventoPorId_DeveRetornarEventoQuandoExistirENaoDeletado() {
        when(eventoRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(evento));

        Optional<EventoResponseDTO> result = eventoService.buscarEventoPorId(1L);

        assertTrue(result.isPresent());
        assertEquals(evento.getTitulo(), result.get().getTitulo());
        verify(eventoRepository, times(1)).findByIdAndDeletedFalse(1L);
    }

    @Test
    void buscarEventoPorId_DeveRetornarVazioQuandoNaoExistirOuDeletado() {
        when(eventoRepository.findByIdAndDeletedFalse(2L)).thenReturn(Optional.empty());

        Optional<EventoResponseDTO> result = eventoService.buscarEventoPorId(2L);

        assertFalse(result.isPresent());
        verify(eventoRepository, times(1)).findByIdAndDeletedFalse(2L);
    }

    @Test
    void listarEventos_DeveRetornarPaginaDeEventosNaoDeletados() {
        Page<Evento> eventosPage = new PageImpl<>(Arrays.asList(evento));
        when(eventoRepository.findByDeletedFalse(any(Pageable.class))).thenReturn(eventosPage);

        Page<EventoResponseDTO> result = eventoService.listarEventos(0, 10);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.getTotalElements());
        assertEquals(evento.getTitulo(), result.getContent().get(0).getTitulo());
        verify(eventoRepository, times(1)).findByDeletedFalse(any(Pageable.class));
    }

    @Test
    void deletarEvento_DeveMarcarEventoComoDeletado() {
        when(eventoRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(evento));
        when(eventoRepository.save(any(Evento.class))).thenReturn(evento);

        boolean result = eventoService.deletarEvento(1L);

        assertTrue(result);
        assertTrue(evento.isDeleted());
        verify(eventoRepository, times(1)).findByIdAndDeletedFalse(1L);
        verify(eventoRepository, times(1)).save(evento);
    }

    @Test
    void deletarEvento_DeveRetornarFalsoQuandoEventoNaoEncontrado() {
        when(eventoRepository.findByIdAndDeletedFalse(anyLong())).thenReturn(Optional.empty());

        boolean result = eventoService.deletarEvento(99L);

        assertFalse(result);
        verify(eventoRepository, times(1)).findByIdAndDeletedFalse(99L);
        verify(eventoRepository, never()).save(any(Evento.class)); // Garante que save não foi chamado
    }
}
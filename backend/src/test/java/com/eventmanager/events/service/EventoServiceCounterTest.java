package com.eventmanager.events.service;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.entity.Evento;
import com.eventmanager.events.repository.EventoRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class EventoServiceCounterTest {

    @Mock
    private EventoRepository eventoRepository;

    @Mock
    private EntityManager entityManager;

    private EventoService eventoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        eventoService = new EventoService(eventoRepository, entityManager);
    }

    @Test
    void testCounterStartsAtZero() {
        // Verify that counter starts at 0
        assertEquals(0L, eventoService.getEventosCreatedCount());
    }

    @Test
    void testCounterIncrementsWhenEventIsCreated() {
        // Setup
        EventoRequestDTO requestDTO = new EventoRequestDTO();
        requestDTO.setTitulo("Test Event");
        requestDTO.setDescricao("Test Description");
        requestDTO.setDataHoraEvento(LocalDateTime.now().plusDays(1));
        requestDTO.setLocal("Test Location");

        Evento savedEvento = new Evento();
        savedEvento.setId(1L);
        savedEvento.setTitulo(requestDTO.getTitulo());
        savedEvento.setDescricao(requestDTO.getDescricao());
        savedEvento.setDataHoraEvento(requestDTO.getDataHoraEvento());
        savedEvento.setLocal(requestDTO.getLocal());
        savedEvento.setDeleted(false);

        when(eventoRepository.save(any(Evento.class))).thenReturn(savedEvento);

        // Verify initial count
        assertEquals(0L, eventoService.getEventosCreatedCount());

        // Create first event
        eventoService.criarEvento(requestDTO);
        assertEquals(1L, eventoService.getEventosCreatedCount());

        // Create second event
        eventoService.criarEvento(requestDTO);
        assertEquals(2L, eventoService.getEventosCreatedCount());

        // Create third event
        eventoService.criarEvento(requestDTO);
        assertEquals(3L, eventoService.getEventosCreatedCount());
    }

    @Test
    void testCounterIsThreadSafe() throws InterruptedException {
        // This test verifies that AtomicLong is being used correctly
        EventoRequestDTO requestDTO = new EventoRequestDTO();
        requestDTO.setTitulo("Thread Test Event");
        requestDTO.setDescricao("Thread Test Description");
        requestDTO.setDataHoraEvento(LocalDateTime.now().plusDays(1));
        requestDTO.setLocal("Thread Test Location");

        Evento savedEvento = new Evento();
        savedEvento.setId(1L);
        savedEvento.setTitulo(requestDTO.getTitulo());
        savedEvento.setDescricao(requestDTO.getDescricao());
        savedEvento.setDataHoraEvento(requestDTO.getDataHoraEvento());
        savedEvento.setLocal(requestDTO.getLocal());
        savedEvento.setDeleted(false);

        when(eventoRepository.save(any(Evento.class))).thenReturn(savedEvento);

        // Create multiple threads to test thread safety
        Thread[] threads = new Thread[10];
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 10; j++) {
                    eventoService.criarEvento(requestDTO);
                }
            });
        }

        // Start all threads
        for (Thread thread : threads) {
            thread.start();
        }

        // Wait for all threads to complete
        for (Thread thread : threads) {
            thread.join();
        }

        // Verify that counter is exactly 100 (10 threads * 10 events each)
        assertEquals(100L, eventoService.getEventosCreatedCount());
    }
}

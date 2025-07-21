package com.eventmanager.events.controller;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.entity.Evento;
import com.eventmanager.events.repository.EventoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.flyway.enabled=false")
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class EventoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EventoRepository eventoRepository;

    @BeforeEach
    void setUp() {
        eventoRepository.deleteAll();
    }

    @Test
    void criarEvento_DeveRetornarStatus201ECorpoCorreto() throws Exception {
        EventoRequestDTO requestDTO = new EventoRequestDTO();
        requestDTO.setTitulo("Evento de Teste");
        requestDTO.setDescricao("Descrição do evento de teste");
        requestDTO.setLocal("Local de Teste");
        requestDTO.setDataHoraEvento(LocalDateTime.now().plusDays(1));

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isCreated()) // Espera status 201 Created
                .andExpect(jsonPath("$.titulo", is("Evento de Teste"))) // Verifica o título no JSON de resposta
                .andExpect(jsonPath("$.id").exists()); // Verifica se o ID foi gerado
    }

    @Test
    void listarEventos_DeveRetornarEventosNaoDeletadosComPaginacao() throws Exception {
        // Prepara dados de teste no banco H2
        eventoRepository.save(new Evento(null, "Evento 1", "Desc 1", LocalDateTime.now().plusDays(1), "Local 1", false));
        eventoRepository.save(new Evento(null, "Evento 2", "Desc 2", LocalDateTime.now().plusDays(2), "Local 2", true)); // Deletado
        eventoRepository.save(new Evento(null, "Evento 3", "Desc 3", LocalDateTime.now().plusDays(3), "Local 3", false));

        mockMvc.perform(get("/api/events?page=0&size=10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Espera status 200 OK
                .andExpect(jsonPath("$.content", hasSize(2))) // Espera 2 eventos não deletados
                .andExpect(jsonPath("$.content[0].titulo", is("Evento 1")))
                .andExpect(jsonPath("$.content[1].titulo", is("Evento 3")));
    }

    @Test
    void buscarEventoPorId_DeveRetornarEventoQuandoExistirENaoDeletado() throws Exception {
        Evento eventoSalvo = eventoRepository.save(new Evento(null, "Evento Buscado", "Desc Buscada", LocalDateTime.now().plusDays(1), "Local Buscado", false));

        mockMvc.perform(get("/api/events/{id}", eventoSalvo.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Espera status 200 OK
                .andExpect(jsonPath("$.titulo", is("Evento Buscado")));
    }

    @Test
    void buscarEventoPorId_DeveRetornar404QuandoNaoExistirOuDeletado() throws Exception {
        Evento eventoDeletado = eventoRepository.save(new Evento(null, "Evento Deletado", "Desc Deletada", LocalDateTime.now().plusDays(1), "Local Deletado", true));

        mockMvc.perform(get("/api/events/{id}", eventoDeletado.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Espera status 404 Not Found

        mockMvc.perform(get("/api/events/{id}", 999L) // ID que não existe
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Espera status 404 Not Found
    }

    @Test
    void atualizarEvento_DeveAtualizarEventoExistente() throws Exception {
        Evento eventoOriginal = eventoRepository.save(new Evento(null, "Original", "Desc Original", LocalDateTime.now().plusDays(5), "Local Original", false));

        EventoRequestDTO requestDTO = new EventoRequestDTO();
        requestDTO.setTitulo("Atualizado");
        requestDTO.setDescricao("Desc Atualizada");
        requestDTO.setLocal("Local Atualizado");
        requestDTO.setDataHoraEvento(LocalDateTime.now().plusDays(10));

        mockMvc.perform(put("/api/events/{id}", eventoOriginal.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo", is("Atualizado")));

        // Verifica no banco de dados que foi atualizado
        Evento eventoVerificado = eventoRepository.findById(eventoOriginal.getId()).orElseThrow();
        assertEquals("Atualizado", eventoVerificado.getTitulo());
    }

    @Test
    void deletarEvento_DeveMarcarEventoComoDeletadoENaoRemoverFisicamente() throws Exception {
        Evento eventoParaDeletar = eventoRepository.save(new Evento(null, "Para Deletar", "Desc", LocalDateTime.now().plusDays(1), "Local", false));

        mockMvc.perform(delete("/api/events/{id}", eventoParaDeletar.getId()))
                .andExpect(status().isNoContent()); // Espera status 204 No Content

        // Verifica no banco de dados que o evento ainda existe, mas com deleted = true
        Optional<Evento> eventoVerificado = eventoRepository.findById(eventoParaDeletar.getId());
        assertTrue(eventoVerificado.isPresent());
        assertTrue(eventoVerificado.get().isDeleted());

        // Tenta buscar o evento deletado via API (deve retornar 404)
        mockMvc.perform(get("/api/events/{id}", eventoParaDeletar.getId()))
                .andExpect(status().isNotFound());
    }
}
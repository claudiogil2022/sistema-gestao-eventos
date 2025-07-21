package com.eventmanager.events.service;

import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.entity.Evento;
import com.eventmanager.events.repository.EventoRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final EntityManager entityManager;

    @Autowired
    public EventoService(EventoRepository eventoRepository, EntityManager entityManager) {
        this.eventoRepository = eventoRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    public EventoResponseDTO criarEvento(EventoRequestDTO requestDTO) {
        // Validação customizada de data
        validateEventDateTime(requestDTO.getDataHoraEvento());
        
        Evento evento = new Evento();
        evento.setTitulo(requestDTO.getTitulo());
        evento.setDescricao(requestDTO.getDescricao());
        evento.setDataHoraEvento(requestDTO.getDataHoraEvento());
        evento.setLocal(requestDTO.getLocal());
        evento.setDeleted(false);

        Evento savedEvento = eventoRepository.save(evento);
        return convertToResponseDTO(savedEvento);
    }
    
    private void validateEventDateTime(LocalDateTime eventDateTime) {
        LocalDateTime now = LocalDateTime.now();
        if (eventDateTime.isBefore(now)) {
            throw new IllegalArgumentException("A data e hora do evento não podem ser no passado");
        }
    }

    public Page<EventoResponseDTO> listarEventos(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return eventoRepository.findByDeletedFalse(pageable)
                .map(this::convertToResponseDTO);
    }

    public Optional<EventoResponseDTO> buscarEventoPorId(Long id) {
        return eventoRepository.findByIdAndDeletedFalse(id)
                .map(this::convertToResponseDTO);
    }


    @Transactional
    public Optional<EventoResponseDTO> atualizarEvento(Long id, EventoRequestDTO requestDTO) {
        // Validação customizada de data
        validateEventDateTime(requestDTO.getDataHoraEvento());
        
        return eventoRepository.findByIdAndDeletedFalse(id)
                .map(evento -> {
                    evento.setTitulo(requestDTO.getTitulo());
                    evento.setDescricao(requestDTO.getDescricao());
                    evento.setDataHoraEvento(requestDTO.getDataHoraEvento());
                    evento.setLocal(requestDTO.getLocal());
                    eventoRepository.save(evento);
                    // Força o flush das alterações para o banco de dados
                    entityManager.flush();
                    // Refresh do objeto para obter os valores atualizados pelos triggers
                    entityManager.refresh(evento);
                    return convertToResponseDTO(evento);
                });
    }

    @Transactional
    public boolean deletarEvento(Long id) {
        return eventoRepository.findByIdAndDeletedFalse(id)
                .map(evento -> {
                    evento.setDeleted(true); // Marca como deletado
                    eventoRepository.save(evento); // Salva a alteração
                    return true;
                }).orElse(false);
    }

    private EventoResponseDTO convertToResponseDTO(Evento evento) {
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
}
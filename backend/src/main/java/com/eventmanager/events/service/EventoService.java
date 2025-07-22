package com.eventmanager.events.service;

import com.eventmanager.events.constants.EventoConstants;
import com.eventmanager.events.dto.EventoRequestDTO;
import com.eventmanager.events.dto.EventoResponseDTO;
import com.eventmanager.events.entity.Evento;
import com.eventmanager.events.factory.EventoDTOFactory;
import com.eventmanager.events.repository.EventoRepository;
import com.eventmanager.events.validator.EventoValidator;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service responsável pela lógica de negócio relacionada a eventos.
 * Aplica princípios de Clean Code:
 * - Responsabilidade Única: apenas lógica de negócio de eventos
 * - Injeção de Dependência: todas as dependências são injetadas
 * - Métodos pequenos: cada método faz apenas uma coisa
 */
@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final EntityManager entityManager;
    private final EventoValidator eventoValidator;
    private final EventoDTOFactory dtoFactory;
    
    // Contador thread-safe para eventos criados desde o início da aplicação
    private final AtomicLong eventosCreatedCounter = new AtomicLong(0);

    @Autowired
    public EventoService(EventoRepository eventoRepository, 
                        EntityManager entityManager,
                        EventoValidator eventoValidator,
                        EventoDTOFactory dtoFactory) {
        this.eventoRepository = eventoRepository;
        this.entityManager = entityManager;
        this.eventoValidator = eventoValidator;
        this.dtoFactory = dtoFactory;
    }

    /**
     * Cria um novo evento após validação das regras de negócio.
     * Incrementa o contador de eventos criados.
     * 
     * @param requestDTO dados do evento a ser criado
     * @return DTO de resposta com os dados do evento criado
     */
    @Transactional
    public EventoResponseDTO criarEvento(EventoRequestDTO requestDTO) {
        // Validação das regras de negócio
        eventoValidator.validateCompleteEvent(
            requestDTO.getTitulo(),
            requestDTO.getDescricao(), 
            requestDTO.getDataHoraEvento(),
            requestDTO.getLocal()
        );

        Evento evento = createEventoFromRequestDTO(requestDTO);
        Evento eventoSalvo = eventoRepository.save(evento);
        
        // Incrementa contador thread-safe
        eventosCreatedCounter.incrementAndGet();
        
        return dtoFactory.createResponseDTO(eventoSalvo);
    }

    /**
     * Lista eventos com paginação, excluindo registros deletados.
     * 
     * @param page número da página (base 0)
     * @param size tamanho da página
     * @return página de eventos convertidos para DTO
     */
    public Page<EventoResponseDTO> listarEventos(int page, int size) {
        Pageable pageable = createPageable(page, size);
        // Com @Where, findAll automaticamente filtra deleted = false
        return eventoRepository.findAll(pageable)
                .map(dtoFactory::createResponseDTO);
    }

    /**
     * Busca um evento específico por ID.
     * 
     * @param id identificador do evento
     * @return Optional contendo o DTO do evento se encontrado
     */
    public Optional<EventoResponseDTO> buscarEventoPorId(Long id) {
        // Com @Where, findById automaticamente filtra deleted = false
        return eventoRepository.findById(id)
                .map(dtoFactory::createResponseDTO);
    }

    /**
     * Atualiza um evento existente após validação.
     * 
     * @param id identificador do evento a ser atualizado
     * @param requestDTO novos dados do evento
     * @return Optional contendo o DTO do evento atualizado
     */
    @Transactional
    public Optional<EventoResponseDTO> atualizarEvento(Long id, EventoRequestDTO requestDTO) {
        // Validação das regras de negócio
        eventoValidator.validateCompleteEvent(
            requestDTO.getTitulo(),
            requestDTO.getDescricao(), 
            requestDTO.getDataHoraEvento(),
            requestDTO.getLocal()
        );
        
        // Com @Where, findById automaticamente filtra deleted = false
        return eventoRepository.findById(id)
                .map(evento -> {
                    updateEventoFromRequestDTO(evento, requestDTO);
                    eventoRepository.save(evento);
                    flushAndRefreshEntity(evento);
                    return dtoFactory.createResponseDTO(evento);
                });
    }

    /**
     * Remove um evento (soft delete) através das anotações Hibernate.
     * 
     * @param id identificador do evento a ser removido
     * @return true se o evento foi removido com sucesso
     */
    @Transactional
    public boolean deletarEvento(Long id) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    // Com @SQLDelete, o repository.delete() vai executar UPDATE ao invés de DELETE
                    eventoRepository.delete(evento);
                    return true;
                }).orElse(false);
    }
    
    // ================ MÉTODOS AUXILIARES PRIVADOS ================
    
    /**
     * Cria uma instância de Evento a partir do DTO de requisição.
     * Método auxiliar que encapsula a lógica de criação da entidade.
     */
    private Evento createEventoFromRequestDTO(EventoRequestDTO requestDTO) {
        Evento evento = new Evento();
        evento.setTitulo(requestDTO.getTitulo());
        evento.setDescricao(requestDTO.getDescricao());
        evento.setDataHoraEvento(requestDTO.getDataHoraEvento());
        evento.setLocal(requestDTO.getLocal());
        evento.setDeleted(false);
        return evento;
    }
    
    /**
     * Atualiza os dados de um evento existente a partir do DTO.
     * Método auxiliar que encapsula a lógica de atualização.
     */
    private void updateEventoFromRequestDTO(Evento evento, EventoRequestDTO requestDTO) {
        evento.setTitulo(requestDTO.getTitulo());
        evento.setDescricao(requestDTO.getDescricao());
        evento.setDataHoraEvento(requestDTO.getDataHoraEvento());
        evento.setLocal(requestDTO.getLocal());
    }

    /**
     * Força o flush das alterações e refresh da entidade.
     * Necessário para obter os valores atualizados pelos triggers do banco.
     */
    private void flushAndRefreshEntity(Evento evento) {
        entityManager.flush();
        entityManager.refresh(evento);
    }

    /**
     * Cria um objeto Pageable com validação dos parâmetros.
     * Aplica limites de segurança para evitar consultas muito grandes.
     */
    private Pageable createPageable(int page, int size) {
        // Aplica limites de segurança
        int safePage = Math.max(page, EventoConstants.DEFAULT_PAGE_NUMBER);
        int safeSize = Math.min(Math.max(size, 1), EventoConstants.MAX_PAGE_SIZE);
        
        return PageRequest.of(safePage, safeSize);
    }
    
    /**
     * Retorna o número total de eventos criados desde o início da aplicação.
     * Este contador é mantido em memória e é reiniciado a cada restart da aplicação.
     * 
     * @return número de eventos criados desde o startup
     */
    public long getEventosCreatedCount() {
        return eventosCreatedCounter.get();
    }
}
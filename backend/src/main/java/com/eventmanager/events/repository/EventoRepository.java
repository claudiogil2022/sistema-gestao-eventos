package com.eventmanager.events.repository;

import com.eventmanager.events.entity.Evento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    // Busca todos os eventos que NÃO estão deletados, com paginação
    Page<Evento> findByDeletedFalse(Pageable pageable);

    // Busca um evento específico pelo ID que NÃO está deletado
    Optional<Evento> findByIdAndDeletedFalse(Long id);
}
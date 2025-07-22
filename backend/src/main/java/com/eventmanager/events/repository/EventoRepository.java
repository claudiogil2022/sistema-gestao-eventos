package com.eventmanager.events.repository;

import com.eventmanager.events.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    // Com @Where(clause = "deleted = false"), todos os métodos padrão 
    // automaticamente filtram registros deletados
    // Não precisamos mais de métodos customizados como findByDeletedFalse
}
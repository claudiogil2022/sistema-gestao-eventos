package com.eventmanager.events.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@SQLDelete(sql = Evento.SOFT_DELETE_SQL)
@Where(clause = Evento.ACTIVE_RECORDS_WHERE)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento {

    // Constantes para manter os valores centralizados e evitar "números mágicos"
    public static final String SOFT_DELETE_SQL = 
        "UPDATE events SET deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    public static final String ACTIVE_RECORDS_WHERE = "deleted = false";
    public static final int TITULO_MAX_LENGTH = 100;
    public static final int DESCRICAO_MAX_LENGTH = 1000;
    public static final int LOCAL_MAX_LENGTH = 200;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = TITULO_MAX_LENGTH)
    private String titulo;

    @Column(nullable = false, length = DESCRICAO_MAX_LENGTH)
    private String descricao;

    @Column(nullable = false)
    private LocalDateTime dataHoraEvento;

    @Column(nullable = false, length = LOCAL_MAX_LENGTH)
    private String local;

    @Column(nullable = false)
    private boolean deleted = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

}
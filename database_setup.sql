-- =====================================================
-- SCRIPT COMPLETO DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema de Gerenciamento de Eventos
-- PostgreSQL 16
-- Data: 2025-07-21
-- =====================================================

-- Criar banco de dados (executar como superuser)
-- CREATE DATABASE eventdb OWNER postgres;

-- Conectar ao banco eventdb
\c eventdb;

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
    -- Chave primária
    id BIGSERIAL PRIMARY KEY,
    
    -- Campos do evento
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    data_hora_evento TIMESTAMP NOT NULL,
    local VARCHAR(200) NOT NULL,
    
    -- Controle de exclusão lógica
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Campos de auditoria
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas por data
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at);
CREATE INDEX IF NOT EXISTS idx_events_updated_at ON events (updated_at);
CREATE INDEX IF NOT EXISTS idx_events_data_hora_evento ON events (data_hora_evento);

-- Índice para consultas de eventos ativos
CREATE INDEX IF NOT EXISTS idx_events_deleted ON events (deleted);

-- Índice composto para consultas comuns (eventos ativos por data)
CREATE INDEX IF NOT EXISTS idx_events_active_by_date ON events (deleted, data_hora_evento) 
WHERE deleted = FALSE;

-- =====================================================
-- FUNÇÕES DE AUDITORIA
-- =====================================================

-- Função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para atualizar automaticamente o campo updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMENTÁRIOS DE DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE events IS 'Tabela principal de eventos do sistema de gerenciamento';

COMMENT ON COLUMN events.id IS 'Identificador único do evento (chave primária auto-incremento)';
COMMENT ON COLUMN events.titulo IS 'Título do evento (máximo 100 caracteres, obrigatório)';
COMMENT ON COLUMN events.descricao IS 'Descrição detalhada do evento (máximo 1000 caracteres, obrigatório)';
COMMENT ON COLUMN events.data_hora_evento IS 'Data e hora de realização do evento (obrigatório)';
COMMENT ON COLUMN events.local IS 'Local onde o evento será realizado (máximo 200 caracteres, obrigatório)';
COMMENT ON COLUMN events.deleted IS 'Flag de exclusão lógica - FALSE=ativo, TRUE=excluído (padrão: FALSE)';
COMMENT ON COLUMN events.created_at IS 'Data e hora de criação do registro (automático)';
COMMENT ON COLUMN events.updated_at IS 'Data e hora da última atualização do registro (automático)';

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir alguns eventos de exemplo para demonstração
INSERT INTO events (titulo, descricao, data_hora_evento, local) VALUES
('Workshop de Desenvolvimento', 'Workshop sobre desenvolvimento de software moderno', '2025-08-15 09:00:00', 'Centro de Convenções'),
('Conferência Tech 2025', 'Conferência anual sobre tecnologia e inovação', '2025-09-10 08:30:00', 'Auditório Principal'),
('Seminário de IA', 'Seminário sobre inteligência artificial e machine learning', '2025-10-05 14:00:00', 'Sala de Conferências'),
('Meetup DevOps', 'Encontro da comunidade DevOps local', '2025-11-20 19:00:00', 'Coworking TechSpace'),
('Hackathon 2025', 'Maratona de programação e inovação', '2025-12-01 08:00:00', 'Campus Universitário')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONSULTAS DE VERIFICAÇÃO
-- =====================================================

-- Verificar estrutura da tabela
\d events

-- Verificar índices criados
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'events';

-- Verificar triggers
SELECT trigger_name, event_manipulation, action_timing, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'events';

-- Verificar total de eventos
SELECT COUNT(*) as total_eventos FROM events;

-- Verificar eventos ativos
SELECT COUNT(*) as eventos_ativos FROM events WHERE deleted = FALSE;

-- =====================================================
-- QUERIES ÚTEIS PARA AUDITORIA
-- =====================================================

-- Eventos criados hoje
-- SELECT * FROM events WHERE DATE(created_at) = CURRENT_DATE;

-- Eventos modificados nas últimas 24 horas
-- SELECT * FROM events WHERE updated_at > NOW() - INTERVAL '24 hours';

-- Estatísticas de criação por mês
-- SELECT 
--     DATE_TRUNC('month', created_at) as mes,
--     COUNT(*) as total_eventos
-- FROM events 
-- GROUP BY DATE_TRUNC('month', created_at)
-- ORDER BY mes;

-- =====================================================
-- BACKUP E RESTORE
-- =====================================================

-- Para fazer backup:
-- pg_dump -U postgres -d eventdb > eventdb_backup.sql

-- Para restaurar:
-- psql -U postgres -d eventdb < eventdb_backup.sql

-- =====================================================
-- CONFIGURAÇÕES DE PERMISSÃO (SE NECESSÁRIO)
-- =====================================================

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER eventapp WITH PASSWORD 'eventapp123';
-- GRANT CONNECT ON DATABASE eventdb TO eventapp;
-- GRANT USAGE ON SCHEMA public TO eventapp;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eventapp;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eventapp;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

COMMIT;

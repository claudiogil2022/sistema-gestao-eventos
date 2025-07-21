-- Migration V4: Adicionar campos de auditoria created_at e updated_at
-- Data: 2025-07-21
-- Descrição: Adiciona campos de controle temporal para auditoria dos registros

ALTER TABLE events 
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Criar índices para melhor performance em consultas por data
CREATE INDEX idx_events_created_at ON events (created_at);
CREATE INDEX idx_events_updated_at ON events (updated_at);
CREATE INDEX idx_events_data_hora_evento ON events (data_hora_evento);

-- Criar função para atualizar automaticamente o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários na tabela e colunas para documentação
COMMENT ON TABLE events IS 'Tabela de eventos do sistema de gerenciamento';
COMMENT ON COLUMN events.id IS 'Identificador único do evento (chave primária)';
COMMENT ON COLUMN events.titulo IS 'Título do evento (máximo 100 caracteres)';
COMMENT ON COLUMN events.descricao IS 'Descrição detalhada do evento (máximo 1000 caracteres)';
COMMENT ON COLUMN events.data_hora_evento IS 'Data e hora de realização do evento';
COMMENT ON COLUMN events.local IS 'Local onde o evento será realizado (máximo 200 caracteres)';
COMMENT ON COLUMN events.deleted IS 'Flag de exclusão lógica (soft delete)';
COMMENT ON COLUMN events.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN events.updated_at IS 'Data e hora da última atualização do registro';

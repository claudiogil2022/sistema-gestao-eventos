# 📊 Schema do Banco de Dados - Sistema de Gerenciamento de Eventos

## 🏗️ **Visão Geral da Arquitetura**

O sistema utiliza **PostgreSQL 16** como banco de dados principal, com controle de migrations via **Flyway** integrado ao Spring Boot.

### **Tecnologias Utilizadas:**
- **SGBD:** PostgreSQL 16-alpine
- **ORM:** Spring Data JPA / Hibernate
- **Migrations:** Flyway
- **Connection Pool:** HikariCP (padrão Spring Boot)

---

## 📋 **Estrutura das Tabelas**

### **Tabela: `events`**

| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-----------|
| `id` | BIGSERIAL | PRIMARY KEY, NOT NULL | Identificador único do evento |
| `titulo` | VARCHAR(100) | NOT NULL | Título do evento |
| `descricao` | VARCHAR(1000) | NOT NULL | Descrição detalhada do evento |
| `data_hora_evento` | TIMESTAMP | NOT NULL | Data e hora de realização |
| `local` | VARCHAR(200) | NOT NULL | Local de realização |
| `deleted` | BOOLEAN | NOT NULL, DEFAULT FALSE | Flag de exclusão lógica |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Data de atualização |

### **Índices:**
```sql
-- Índice da chave primária (automático)
events_pkey (id) - PRIMARY KEY, BTREE

-- Índices de performance para consultas por data
idx_events_created_at (created_at) - BTREE
idx_events_updated_at (updated_at) - BTREE  
idx_events_data_hora_evento (data_hora_evento) - BTREE
```

### **Triggers:**
```sql
-- Trigger para atualização automática do campo updated_at
update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column()
```

---

## 🗂️ **Migrations (Histórico de Versões)**

### **V1__create_events_table.sql** *(Inicial)*
```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(1000) NOT NULL,
    data_hora_evento TIMESTAMP NOT NULL,
    local VARCHAR(200) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE
);
```

### **V3__remove_capacidade_column.sql** *(Remoção de Campo)*
```sql
-- Remove campo capacidade conforme requisitos do desafio
ALTER TABLE events DROP COLUMN IF EXISTS capacidade;
```

### **V4__add_audit_columns.sql** *(Campos de Auditoria)*
```sql
-- Adiciona campos de auditoria temporal
ALTER TABLE events 
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Índices para performance
CREATE INDEX idx_events_created_at ON events (created_at);
CREATE INDEX idx_events_updated_at ON events (updated_at);
CREATE INDEX idx_events_data_hora_evento ON events (data_hora_evento);

-- Função e trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

---

## ⚙️ **Configuração do Banco**

### **Docker Compose Configuration:**
```yaml
postgres_db:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: eventdb
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres123
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d eventdb"]
    interval: 10s
    timeout: 5s
    retries: 5
```

### **Spring Boot Configuration:**
```properties
# Database Connection
spring.datasource.url=jdbc:postgresql://postgres_db:5432/eventdb
spring.datasource.username=postgres
spring.datasource.password=postgres123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Flyway Migration
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

---

## 🔍 **Relacionamentos e Normalização**

### **Estrutura Atual:**
- **Tabela única:** `events` (modelo simples conforme especificação)
- **Chave primária:** `id` (BIGSERIAL)
- **Soft Delete:** Campo `deleted` para exclusão lógica
- **Auditoria:** Campos `created_at` e `updated_at` com trigger automático

### **Futuras Expansões (Preparado para):**
```sql
-- Possíveis tabelas futuras para expansão do sistema:

-- Categorias de eventos
CREATE TABLE event_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuários do sistema
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relacionamento eventos-categorias (futura FK)
-- ALTER TABLE events ADD COLUMN category_id BIGINT REFERENCES event_categories(id);

-- Relacionamento eventos-criador (futura FK)  
-- ALTER TABLE events ADD COLUMN created_by BIGINT REFERENCES users(id);
```

---

## 📊 **Scripts de Verificação**

### **Verificar Estrutura:**
```sql
-- Verificar tabela events
\d events

-- Verificar índices
\di

-- Verificar triggers
\dy
```

### **Consultas de Auditoria:**
```sql
-- Eventos criados hoje
SELECT * FROM events 
WHERE DATE(created_at) = CURRENT_DATE;

-- Eventos modificados nas últimas 24h
SELECT * FROM events 
WHERE updated_at > NOW() - INTERVAL '24 hours';

-- Estatísticas de criação por mês
SELECT 
    DATE_TRUNC('month', created_at) as mes,
    COUNT(*) as total_eventos
FROM events 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes;
```

---

## 🔒 **Considerações de Performance**

### **Índices Estratégicos:**
- `id` (PK) - Busca rápida por ID
- `created_at` - Consultas por data de criação
- `updated_at` - Consultas por última modificação
- `data_hora_evento` - Busca por eventos futuros/passados

### **Otimizações Implementadas:**
- **Connection Pool:** HikariCP otimizado
- **Lazy Loading:** JPA configurado para carregamento eficiente
- **Trigger Automático:** `updated_at` atualizado automaticamente
- **Soft Delete:** Preserva histórico sem impacto em performance

---

## 🚀 **Status do Banco**

✅ **PostgreSQL 16** rodando em container Docker  
✅ **Flyway Migrations** aplicadas (V1, V3, V4)  
✅ **25 eventos de teste** carregados  
✅ **Índices otimizados** criados  
✅ **Triggers de auditoria** funcionando  
✅ **Paginação** implementada e testada  

**Conexão:** `postgresql://postgres:postgres123@localhost:5432/eventdb`

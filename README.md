# 🎯 Sistema de Gerenciamento de Eventos

## 📋 Sobre o Projeto

Sistema completo de gerenciamento de eventos desenvolvido com Spring Boot, PostgreSQL e Bootstrap. O sistema permite criar, listar, editar e remover eventos com paginação e campos de auditoria.

## 🏗️ Arquitetura

```
Frontend (Bootstrap + Vanilla JS) → nginx:3000
                ↓
Backend (Spring Boot 3.3.1) → :8080  
                ↓
PostgreSQL 16-alpine → :5432
```

## 🚀 Tecnologias Utilizadas

### Backend
- **Spring Boot 3.3.1**
- **Java 17**
- **PostgreSQL 16**
- **Flyway** (Migrations)
- **JPA/Hibernate**
- **Docker & Docker Compose**

### Frontend
- **Bootstrap 5.3.2**
- **Vanilla JavaScript**
- **HTML5 & CSS3**
- **Nginx**

## 📦 Funcionalidades

- ✅ **CRUD completo de eventos**
- ✅ **Paginação** (25 registros em 6 páginas)
- ✅ **Soft Delete** (exclusão lógica)
- ✅ **Campos de auditoria** (created_at, updated_at)
- ✅ **Validação de dados**
- ✅ **API RESTful**
- ✅ **Interface responsiva**

## 🗄️ Modelo de Dados

```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao VARCHAR(1000),
    data_hora_evento TIMESTAMP NOT NULL,
    local VARCHAR(200) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Como Executar

### Pré-requisitos
- Docker & Docker Compose
- Git

### Execução Completa
```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/evento-manager.git
cd evento-manager

# Executar com Docker Compose
docker-compose -f docker-compose-banco.yml up -d

# Acessar a aplicação
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

## 📚 API Endpoints

### Eventos
- `GET /api/eventos?page=0&size=5` - Listar eventos com paginação
- `POST /api/eventos` - Criar novo evento
- `GET /api/eventos/{id}` - Buscar evento por ID
- `PUT /api/eventos/{id}` - Atualizar evento
- `DELETE /api/eventos/{id}` - Remover evento (soft delete)

### Exemplo de Payload
```json
{
  "titulo": "Workshop de Tecnologia",
  "descricao": "Workshop sobre novas tecnologias",
  "dataHoraEvento": "2025-08-15T09:00:00",
  "local": "Centro de Convenções"
}
```

## 🗃️ Migrations do Banco

- **V1**: Criação inicial da tabela events
- **V3**: Remoção do campo capacidade
- **V4**: Adição de campos de auditoria (created_at, updated_at)

## 🔍 Campos de Auditoria

O sistema implementa rastreamento automático de:
- **created_at**: Data/hora de criação (imutável)
- **updated_at**: Data/hora da última modificação (atualizada automaticamente)

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
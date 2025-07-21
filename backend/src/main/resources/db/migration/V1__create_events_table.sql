CREATE TABLE events (
                        id BIGSERIAL PRIMARY KEY,
                        titulo VARCHAR(100) NOT NULL,
                        descricao VARCHAR(1000) NOT NULL,
                        data_hora_evento TIMESTAMP NOT NULL,
                        local VARCHAR(200) NOT NULL,
                        deleted BOOLEAN NOT NULL DEFAULT FALSE
);
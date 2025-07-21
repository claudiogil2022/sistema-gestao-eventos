package com.eventmanager.events.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Indica que esta classe contém definições de beans do Spring
public class OpenApiConfig {

    @Bean // Define um bean que será gerenciado pelo Spring
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Gestão de Eventos")
                        .version("1.0")
                        .description("API RESTful para gerenciar eventos, permitindo cadastro, listagem, edição e exclusão (soft delete)."));
    }
}
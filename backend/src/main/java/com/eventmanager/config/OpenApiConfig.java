package com.eventmanager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do OpenAPI/Swagger para documentação da API
 */
@Configuration
public class OpenApiConfig {

    @Value("${openapi.dev-url:http://localhost:8080}")
    private String devUrl;

    @Value("${openapi.prod-url:http://localhost:8080}")
    private String prodUrl;

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);
        devServer.setDescription("Servidor de Desenvolvimento");

        Server prodServer = new Server();
        prodServer.setUrl(prodUrl);
        prodServer.setDescription("Servidor de Produção");

        Contact contact = new Contact();
        contact.setEmail("admin@eventmanager.com");
        contact.setName("Sistema de Gestão de Eventos");
        contact.setUrl("https://www.eventmanager.com");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("API de Gestão de Eventos")
                .version("1.0")
                .contact(contact)
                .description("Esta API expõe endpoints para gerenciar eventos, incluindo operações CRUD, filtros e paginação.")
                .termsOfService("https://www.eventmanager.com/terms")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer));
    }
}

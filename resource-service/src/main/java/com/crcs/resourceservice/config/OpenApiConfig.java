package com.crcs.resourceservice.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI crcsResourceServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CRCS Resource Service API")
                        .description("Resource management service for Campus Resource Coordination System. " +
                                "Manages campus resources including rooms, labs, and equipment. " +
                                "Provides CRUD operations, availability tracking, and resource status management. " +
                                "Requires RESOURCE_MANAGER, FACILITY_MANAGER, or ADMIN role for management operations.")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("CRCS Team")
                                .email("support@crcs.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")))
                .servers(List.of(
                        new Server().url("http://localhost:6003").description("Local Development Server"),
                        new Server().url("http://localhost:6000").description("API Gateway")
                ))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT token. Management operations require RESOURCE_MANAGER, FACILITY_MANAGER, or ADMIN role.")));
    }
}

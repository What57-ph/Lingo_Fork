package com.lingo.chatbot.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Group 7",
                        email = "0plmzxc@gmail.com"
                ),
                description = "Api Documentation for PrepIelts E-Learning website",
                title = "Chatbot Api specification - Vinh",
                version = "1.0",
                license = @License(
                        name = "MIT License",
                        url = "https://opensource.org/licenses/MIT"
                ),
                termsOfService = "https://laptrinhfullstack.vercel.app/terms"
        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:9006"
                ),
                @Server(
                        description = "Prod ENV",
                        url = "https://chatbot.com"
                ),
        }
)
public class OpenApiConfig {
}

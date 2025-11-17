package com.lingo.fileservice.config;

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
                title = "File management Api specification - Connect to Google Cloud Console - Vinh",
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
                        url = "http://localhost:9004"
                ),
                @Server(
                        description = "Prod ENV",
                        url = "https://file-service.com"
                ),
        }
)
public class OpenApiConfig {
}

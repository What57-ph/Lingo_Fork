package com.lingo.notificationservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.result.view.freemarker.FreeMarkerConfigurer;

@Configuration
public class FreeMarkerConfig {
  @Bean
  public FreeMarkerConfigurer freeMarkerConfigurer() {
    FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
    configurer.setTemplateLoaderPath("classpath:/templates/");
    return configurer;
  }
}
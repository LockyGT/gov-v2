package com.solucionesdigitales.vote.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.solucionesdigitales.vote.config.security.SecurityContext;

@Configuration
public class AppConfig {
     //    @return Spring Boot {@link CommandLineRunner} automatically
     //          run after app context is loaded.
	@Autowired
	SecurityContext sec;
     @Bean
    public CommandLineRunner commandLineRunner(ApplicationContext ctx) {
            return args -> {
           sec.validate();
        };
    }
}
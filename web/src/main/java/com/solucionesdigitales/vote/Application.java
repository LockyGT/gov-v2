
package com.solucionesdigitales.vote;

import java.net.SocketException;
import java.util.concurrent.Executor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import com.solucionesdigitales.vote.service.config.StorageConfig;

@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan("com.solucionesdigitales.vote")
@EntityScan("com.solucionesdigitales.vote.entity")
@EnableMongoRepositories("com.solucionesdigitales.vote.repository")
@EnableConfigurationProperties(StorageConfig.class)
@EnableAsync
public class Application {

	public static void main(String[] args) throws SocketException {
		SpringApplication.run(Application.class, args);
	}
	
	@Bean
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(2);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("VoteCounter-");
        executor.initialize();
        return executor;
    }
}

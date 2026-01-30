package com.crcs.resourceservice;

import com.crcs.common.config.DotenvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.crcs.resourceservice", "com.crcs.kafka"})
public class ResourceServiceApplication {

    public static void main(String[] args) {
        // Load .env file if it exists
        DotenvLoader.loadDotenv();
        
        SpringApplication.run(ResourceServiceApplication.class, args);
    }
}

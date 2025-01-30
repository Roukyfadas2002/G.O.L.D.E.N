package com.src.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import com.src.backend.configuration.flyway.FlywayMigrationRunner;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Charger le contexte Spring
        ApplicationContext context = SpringApplication.run(BackendApplication.class, args);

        // Exécuter les migrations Flyway
        FlywayMigrationRunner flywayMigrationRunner = context.getBean(FlywayMigrationRunner.class);
        flywayMigrationRunner.runMigration();
    }
}

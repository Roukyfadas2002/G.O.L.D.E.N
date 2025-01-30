package com.src.backend.configuration.flyway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FlywayMigrationRunner {

    @Value("${spring.flyway.locations}")
    private String scriptRelativePath;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUsr;

    @Value("${spring.datasource.password}")
    private String dbPwd;

    public void runMigration() {
        CommonFlywayDatabaseMigration.runFlywayMigration(scriptRelativePath, dbUrl, dbUsr, dbPwd);
    }
}

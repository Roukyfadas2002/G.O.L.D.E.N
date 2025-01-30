package com.src.backend.configuration.flyway;

import org.flywaydb.core.Flyway;

import jakarta.persistence.EntityManagerFactory;

/**
 * Database migration management (structure and data).
 */
public class CommonFlywayDatabaseMigration {

	private CommonFlywayDatabaseMigration() {
	}

	/**
	 * Database migration management (structure and data).<br/>
	 * To be used before creating the database {@link EntityManagerFactory}.
	 * 
	 * @param scriptRelativePath the location of the SQL scripts that perform the database migration.
	 * @param dbUrl the database connection url.
	 * @param dbUsr the user database.
	 * @param dbPwd the user password.
	 */
	public static void runFlywayMigration(String scriptRelativePath, String dbUrl, String dbUsr, String dbPwd) {
		Flyway flyway = Flyway.configure()
		        .locations(scriptRelativePath)
		        .baselineOnMigrate(true)
		        .dataSource(dbUrl, dbUsr, dbPwd)
		        .load();
		flyway.migrate();
	}
}
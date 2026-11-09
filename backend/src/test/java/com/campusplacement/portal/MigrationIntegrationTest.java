package com.campusplacement.portal;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:migrations;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
      "spring.sql.init.mode=never",
      "spring.flyway.enabled=true"
    })
@ActiveProfiles("test")
class MigrationIntegrationTest {
  @Autowired JdbcTemplate db;

  @Test
  void migrationsCreateCleanSchemaWithoutDemoAccounts() {
    assertThat(db.queryForObject("SELECT COUNT(*) FROM users", Integer.class)).isZero();
    assertThat(db.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class)).isZero();
    db.update(
        "INSERT INTO users (name,email,password_hash,role) VALUES"
            + " ('Student','migration@example.com','hash','student')");
    db.update("INSERT INTO profiles (user_id,cgpa) VALUES (1,10.00)");
    assertThat(db.queryForObject("SELECT cgpa FROM profiles WHERE user_id=1", Double.class))
        .isEqualTo(10.0);
    assertThat(
            db.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success=TRUE AND version IS NOT"
                    + " NULL",
                Integer.class))
        .isEqualTo(2);
  }

  @Test
  void existingSchemaIsBaselinedWithoutDeletingData() {
    var source =
        new org.springframework.jdbc.datasource.DriverManagerDataSource(
            "jdbc:h2:mem:existing;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1", "sa", "");
    new org.springframework.jdbc.datasource.init.ResourceDatabasePopulator(
            new org.springframework.core.io.ClassPathResource("schema.sql"))
        .execute(source);
    var existing = new JdbcTemplate(source);
    existing.update(
        "INSERT INTO users (name,email,password_hash,role) VALUES ('Keep"
            + " Me','existing@example.com','hash','student')");
    org.flywaydb.core.Flyway.configure()
        .dataSource(source)
        .baselineOnMigrate(true)
        .baselineVersion("0")
        .locations("classpath:db/migration")
        .load()
        .migrate();
    assertThat(
            existing.queryForObject(
                "SELECT name FROM users WHERE email='existing@example.com'", String.class))
        .isEqualTo("Keep Me");
    assertThat(
            existing.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE success=TRUE AND version IS NOT"
                    + " NULL",
                Integer.class))
        .isEqualTo(3);
  }
}

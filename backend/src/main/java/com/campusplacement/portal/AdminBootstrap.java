package com.campusplacement.portal;

import java.nio.charset.StandardCharsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Opt-in first-admin provisioning. Credentials are supplied through environment variables, never
 * logged.
 */
@Component
@Profile("bootstrap-admin")
public class AdminBootstrap implements ApplicationRunner {
  private static final org.slf4j.Logger log =
      org.slf4j.LoggerFactory.getLogger(AdminBootstrap.class);
  private final JdbcTemplate db;
  private final PasswordEncoder passwords;
  private final String email;
  private final String password;

  public AdminBootstrap(
      JdbcTemplate db,
      PasswordEncoder passwords,
      @Value("${BOOTSTRAP_ADMIN_EMAIL}") String email,
      @Value("${BOOTSTRAP_ADMIN_PASSWORD}") String password) {
    this.db = db;
    this.passwords = passwords;
    this.email = email;
    this.password = password;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!db.queryForList("SELECT id FROM users WHERE role='admin'").isEmpty())
      throw new IllegalStateException(
          "An administrator already exists. Disable the bootstrap-admin profile.");
    if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        || password.length() < 12
        || password.getBytes(StandardCharsets.UTF_8).length > 72)
      throw new IllegalArgumentException(
          "Admin email must be valid and password must have 12+ characters and no more than 72"
              + " UTF-8 bytes");
    db.update(
        "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,'admin')",
        "Placement Administrator",
        email,
        passwords.encode(password));
    log.info(
        "Initial administrator created. Disable the bootstrap-admin profile and clear bootstrap"
            + " credentials.");
  }
}

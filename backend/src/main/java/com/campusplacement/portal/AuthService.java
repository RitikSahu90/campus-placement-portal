package com.campusplacement.portal;

import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final JdbcTemplate db;
  private final PasswordEncoder passwords;
  private final JwtEncoder tokens;
  private final Duration ttl;

  public AuthService(
      JdbcTemplate db,
      PasswordEncoder passwords,
      JwtEncoder tokens,
      @Value("${app.jwt-ttl}") Duration ttl) {
    this.db = db;
    this.passwords = passwords;
    this.tokens = tokens;
    this.ttl = ttl;
    if (ttl.isNegative() || ttl.isZero())
      throw new IllegalArgumentException("JWT_TTL must be positive");
  }

  @Transactional
  public Map<String, Object> register(Requests.Register input) {
    if (!db.queryForList("SELECT id FROM users WHERE email = ?", input.email()).isEmpty())
      throw new ApiException(409, "Email is already registered");
    db.update(
        "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)",
        input.name(),
        input.email(),
        passwords.encode(input.password()),
        input.role());
    return session(
        db.queryForMap("SELECT id,name,email,role FROM users WHERE email = ?", input.email()));
  }

  public Map<String, Object> login(Requests.Login input) {
    List<Map<String, Object>> users =
        db.queryForList("SELECT * FROM users WHERE email = ?", input.email());
    if (users.isEmpty()
        || !passwords.matches(input.password(), (String) users.getFirst().get("password_hash")))
      throw new ApiException(401, "Invalid email or password");
    return session(user(((Number) users.getFirst().get("id")).longValue()));
  }

  public Map<String, Object> user(long id) {
    var rows = db.queryForList("SELECT id,name,email,role FROM users WHERE id = ?", id);
    if (rows.isEmpty()) throw new ApiException(404, "User not found");
    return rows.getFirst();
  }

  private Map<String, Object> session(Map<String, Object> user) {
    Instant now = Instant.now();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .subject(user.get("id").toString())
            .issuedAt(now)
            .expiresAt(now.plus(ttl))
            .claim("id", user.get("id"))
            .claim("name", user.get("name"))
            .claim("email", user.get("email"))
            .claim("role", user.get("role"))
            .build();
    String token =
        tokens
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
    return Map.of("user", user, "token", token);
  }
}

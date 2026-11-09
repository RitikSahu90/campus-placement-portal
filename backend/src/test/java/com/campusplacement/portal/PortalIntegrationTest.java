package com.campusplacement.portal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.jayway.jsonpath.JsonPath;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class PortalIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate db;
  @Autowired JwtEncoder encoder;

  private String login(String role) throws Exception {
    String body =
        mvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"email\":\"" + role + "@example.com\",\"password\":\"Password@123\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.user.role").value(role))
            .andReturn()
            .getResponse()
            .getContentAsString();
    return "Bearer " + JsonPath.read(body, "$.data.token");
  }

  private String jobBody(String title, String company) {
    return "{\"title\":\""
        + title
        + "\",\"description\":\"Build APIs\",\"location\":\"Remote\",\"companyName\":\""
        + company
        + "\",\"deadline\":\"2099-12-31\",\"status\":\"open\"}";
  }

  @Test
  void publicEndpointsAndSeededLogin() throws Exception {
    mvc.perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.success").value(true));
    mvc.perform(get("/api/jobs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].company_name").value("BluePeak Technologies"));
    mvc.perform(get("/api/jobs/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.id").value(1))
        .andExpect(jsonPath("$.data.deadline").isString());
    for (String role : new String[] {"student", "recruiter", "admin"}) {
      mvc.perform(get("/api/auth/me").header("Authorization", login(role)))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.data.role").value(role))
          .andExpect(jsonPath("$.data.password_hash").doesNotExist());
    }
  }

  @Test
  void registerHashesPasswordAndRejectsDuplicate() throws Exception {
    String body =
        "{\"name\":\"New"
            + " Student\",\"email\":\"new@example.com\",\"password\":\"Password@123\",\"role\":\"student\"}";
    mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.token").isString());
    assertThat(
            db.queryForObject(
                "SELECT password_hash FROM users WHERE email='new@example.com'", String.class))
        .startsWith("$2")
        .isNotEqualTo("Password@123");
    mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isConflict());
  }

  @Test
  void unauthorizedAndWrongRoleAreJsonErrors() throws Exception {
    mvc.perform(get("/api/profile"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.success").value(false));
    mvc.perform(get("/api/users").header("Authorization", login("student")))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.success").value(false));
    mvc.perform(
            post("/api/jobs")
                .header("Authorization", login("student"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(jobBody("Test", "Test")))
        .andExpect(status().isForbidden());
    mvc.perform(get("/api/profile").header("Authorization", "Bearer broken"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void expiredJwtIsRejected() throws Exception {
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .subject("1")
            .issuedAt(Instant.now().minusSeconds(300))
            .expiresAt(Instant.now().minusSeconds(120))
            .claim("id", 1)
            .claim("role", "student")
            .build();
    String token =
        encoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
    mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void loginAndRequestValidation() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"student@example.com\",\"password\":\"wrong\"}"))
        .andExpect(status().isUnauthorized());
    mvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"bad\",\"role\":\"unknown\"}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.success").value(false));
    mvc.perform(
            post("/api/jobs")
                .header("Authorization", login("recruiter"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Missing fields\"}"))
        .andExpect(status().isBadRequest());
    mvc.perform(get("/api/jobs/not-a-number")).andExpect(status().isBadRequest());
    mvc.perform(get("/api/jobs/9999")).andExpect(status().isNotFound());
  }

  @Test
  void profileSupportsCreateAndUpdateAndZeroCgpa() throws Exception {
    String token = login("student");
    db.update("DELETE FROM profiles WHERE user_id=1");
    mvc.perform(get("/api/profile").header("Authorization", token))
        .andExpect(jsonPath("$.data").isEmpty());
    for (int i = 0; i < 2; i++)
      mvc.perform(
              put("/api/profile")
                  .header("Authorization", token)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(
                      "{\"department\":\"Computer"
                          + " Science\",\"graduationYear\":2027,\"cgpa\":0,\"resumeUrl\":\"https://example.com/resume.pdf\"}"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$.data.graduation_year").value(2027))
          .andExpect(jsonPath("$.data.cgpa").value(0));
    assertThat(db.queryForObject("SELECT COUNT(*) FROM profiles WHERE user_id=1", Integer.class))
        .isEqualTo(1);
  }

  @Test
  void recruiterCrudUpdatesCompanyAndAdminDeletes() throws Exception {
    String token = login("recruiter");
    String body =
        mvc.perform(
                post("/api/jobs")
                    .header("Authorization", token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(jobBody("Java Developer", "Original Co")))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.company_name").value("Original Co"))
            .andReturn()
            .getResponse()
            .getContentAsString();
    Number id = JsonPath.read(body, "$.data.id");
    mvc.perform(
            put("/api/jobs/" + id)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jobBody("Senior Java Developer", "Updated Co")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.title").value("Senior Java Developer"))
        .andExpect(jsonPath("$.data.company_name").value("Updated Co"));
    mvc.perform(delete("/api/jobs/" + id).header("Authorization", login("admin")))
        .andExpect(status().isOk());
    mvc.perform(get("/api/jobs/" + id)).andExpect(status().isNotFound());
  }

  @Test
  void recruiterCannotEditOrDeleteAnotherRecruitersJob() throws Exception {
    db.update(
        "INSERT INTO users (name,email,password_hash,role) SELECT"
            + " 'Other','other@example.com',password_hash,'recruiter' FROM users WHERE id=2");
    String body =
        mvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"other@example.com\",\"password\":\"Password@123\"}"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    String token = "Bearer " + JsonPath.read(body, "$.data.token");
    mvc.perform(
            put("/api/jobs/1")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(jobBody("Stolen", "Stolen Co")))
        .andExpect(status().isForbidden());
    mvc.perform(delete("/api/jobs/1").header("Authorization", token))
        .andExpect(status().isNotFound());
    assertThat(db.queryForObject("SELECT name FROM companies WHERE id=1", String.class))
        .isEqualTo("BluePeak Technologies");
  }

  @Test
  void applicationsAreUniqueScopedAndValidateJobState() throws Exception {
    String student = login("student");
    mvc.perform(
            post("/api/applications")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":2,\"coverLetter\":\"Hello\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.status").value("applied"));
    mvc.perform(
            post("/api/applications")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":2}"))
        .andExpect(status().isConflict());
    mvc.perform(get("/api/applications").header("Authorization", student))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(2));
    mvc.perform(get("/api/applications").header("Authorization", login("recruiter")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].student_name").value("Aarav Student"));
    db.update("UPDATE jobs SET status='closed' WHERE id=2");
    mvc.perform(
            post("/api/applications")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":2}"))
        .andExpect(status().isBadRequest());
    db.update("UPDATE jobs SET status='open',deadline='2000-01-01' WHERE id=2");
    mvc.perform(
            post("/api/applications")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"jobId\":2}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void adminDeletionCascadesAndNeverReturnsPasswords() throws Exception {
    String admin = login("admin");
    mvc.perform(get("/api/users").header("Authorization", admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].password_hash").doesNotExist());
    mvc.perform(delete("/api/users/1").header("Authorization", admin)).andExpect(status().isOk());
    assertThat(db.queryForObject("SELECT COUNT(*) FROM profiles WHERE user_id=1", Integer.class))
        .isZero();
    assertThat(
            db.queryForObject(
                "SELECT COUNT(*) FROM applications WHERE student_id=1", Integer.class))
        .isZero();
    mvc.perform(delete("/api/users/9999").header("Authorization", admin))
        .andExpect(status().isNotFound());
  }

  @Test
  void corsAllowsConfiguredFrontend() throws Exception {
    mvc.perform(
            options("/api/profile")
                .header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "PUT")
                .header("Access-Control-Request-Headers", "authorization,content-type"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
  }

  @Test
  void publicAdminRegistrationIsDisabled() throws Exception {
    mvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\":\"Untrusted"
                        + " Admin\",\"email\":\"badadmin@example.com\",\"password\":\"Password@123\",\"role\":\"admin\"}"))
        .andExpect(status().isBadRequest());
    assertThat(
            db.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email='badadmin@example.com'", Integer.class))
        .isZero();
  }

  @Test
  void recruiterOwnJobsEndpointIsProtectedAndScoped() throws Exception {
    mvc.perform(get("/api/jobs/mine")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/jobs/mine").header("Authorization", login("student")))
        .andExpect(status().isForbidden());
    db.update(
        "INSERT INTO users (name,email,password_hash,role) SELECT"
            + " 'Other','scoped@example.com',password_hash,'recruiter' FROM users WHERE id=2");
    db.update(
        "INSERT INTO companies (recruiter_id,name) SELECT id,'Other Co' FROM users WHERE"
            + " email='scoped@example.com'");
    db.update(
        "INSERT INTO jobs (company_id,recruiter_id,title,description,location,deadline) SELECT"
            + " c.id,c.recruiter_id,'Other role','Other work','Remote','2099-01-01' FROM companies"
            + " c WHERE c.name='Other Co'");
    mvc.perform(get("/api/jobs/mine").header("Authorization", login("recruiter")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(2))
        .andExpect(jsonPath("$.data[0].recruiter_id").value(2));
  }

  @Test
  void recruiterCanUpdateApplicantAndStudentSeesIt() throws Exception {
    mvc.perform(
            patch("/api/applications/1/status")
                .header("Authorization", login("student"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"selected\"}"))
        .andExpect(status().isForbidden());
    String recruiter = login("recruiter");
    mvc.perform(
            patch("/api/applications/1/status")
                .header("Authorization", recruiter)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"shortlisted\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.status").value("shortlisted"));
    mvc.perform(get("/api/applications").header("Authorization", login("student")))
        .andExpect(jsonPath("$.data[0].status").value("shortlisted"));
    mvc.perform(
            patch("/api/applications/1/status")
                .header("Authorization", recruiter)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"invented\"}"))
        .andExpect(status().isBadRequest());
    db.update("UPDATE jobs SET recruiter_id=3 WHERE id=1");
    mvc.perform(
            patch("/api/applications/1/status")
                .header("Authorization", recruiter)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"selected\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void deletedAccountTokensAreRejectedAndAdminsCannotDeleteThemselves() throws Exception {
    String student = login("student");
    String admin = login("admin");
    mvc.perform(delete("/api/users/3").header("Authorization", admin))
        .andExpect(status().isBadRequest());
    mvc.perform(delete("/api/users/1").header("Authorization", admin)).andExpect(status().isOk());
    mvc.perform(get("/api/profile").header("Authorization", student))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void perfectCgpaAcceptedAndUnsafeResumeUrlRejected() throws Exception {
    String student = login("student");
    mvc.perform(
            put("/api/profile")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"cgpa\":10,\"resumeUrl\":\"https://example.com/resume.pdf\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.cgpa").value(10));
    mvc.perform(
            put("/api/profile")
                .header("Authorization", student)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"resumeUrl\":\"javascript:alert(1)\"}"))
        .andExpect(status().isBadRequest());
  }

  @Test
  void healthProbeDoesNotExposeDatabaseDetails() throws Exception {
    mvc.perform(get("/actuator/health/readiness"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("UP"))
        .andExpect(jsonPath("$.components").doesNotExist());
  }

  @Test
  void adminBootstrapValidatesAndCreatesOnlyInitialAdmin() throws Exception {
    var passwords = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    var bootstrap =
        new AdminBootstrap(db, passwords, "privateadmin@example.com", "StrongSecret@123");
    org.assertj.core.api.Assertions.assertThatThrownBy(() -> bootstrap.run(null))
        .isInstanceOf(IllegalStateException.class);
    db.update("DELETE FROM users WHERE role='admin'");
    org.assertj.core.api.Assertions.assertThatThrownBy(
            () -> new AdminBootstrap(db, passwords, "invalid-email", "weak").run(null))
        .isInstanceOf(IllegalArgumentException.class);
    bootstrap.run(null);
    String hash =
        db.queryForObject(
            "SELECT password_hash FROM users WHERE email='privateadmin@example.com'", String.class);
    assertThat(passwords.matches("StrongSecret@123", hash)).isTrue();
    mvc.perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"email\":\"privateadmin@example.com\",\"password\":\"StrongSecret@123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.user.role").value("admin"));
  }
}

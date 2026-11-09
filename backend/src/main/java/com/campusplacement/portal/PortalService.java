package com.campusplacement.portal;

import java.sql.*;
import java.util.*;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PortalService {
  private final JdbcTemplate db;
  private static final String JOBS =
      "SELECT jobs.*, companies.name AS company_name, users.name AS recruiter_name FROM jobs JOIN"
          + " companies ON companies.id=jobs.company_id JOIN users ON users.id=jobs.recruiter_id";
  private static final String APPLICATION =
      "SELECT applications.*, jobs.title, companies.name AS company_name FROM applications JOIN"
          + " jobs ON jobs.id=applications.job_id JOIN companies ON companies.id=jobs.company_id";

  public PortalService(JdbcTemplate db) {
    this.db = db;
  }

  public List<Map<String, Object>> jobs() {
    return db.queryForList(JOBS + " ORDER BY jobs.created_at DESC");
  }

  public Map<String, Object> job(long id) {
    return one(JOBS + " WHERE jobs.id=?", "Job not found", id);
  }

  @Transactional
  public Map<String, Object> createJob(long recruiter, Requests.Job input) {
    long company = company(recruiter, input);
    long id =
        insert(
            "INSERT INTO jobs"
                + " (company_id,recruiter_id,title,description,location,salary,job_type,eligibility_criteria,deadline,status)"
                + " VALUES (?,?,?,?,?,?,?,?,?,?)",
            company,
            recruiter,
            input.title(),
            input.description(),
            input.location(),
            input.salary(),
            fallback(input.jobType(), "full-time"),
            input.eligibilityCriteria(),
            input.deadline(),
            fallback(input.status(), "open"));
    return job(id);
  }

  @Transactional
  public Map<String, Object> updateJob(long id, long recruiter, Requests.Job input) {
    Map<String, Object> existing = job(id);
    if (((Number) existing.get("recruiter_id")).longValue() != recruiter)
      throw new ApiException(403, "Only the job owner can update this job");
    company(recruiter, input);
    db.update(
        "UPDATE jobs SET"
            + " title=?,description=?,location=?,salary=?,job_type=?,eligibility_criteria=?,deadline=?,status=?"
            + " WHERE id=? AND recruiter_id=?",
        input.title(),
        input.description(),
        input.location(),
        input.salary(),
        fallback(input.jobType(), "full-time"),
        input.eligibilityCriteria(),
        input.deadline(),
        fallback(input.status(), "open"),
        id,
        recruiter);
    return job(id);
  }

  private long company(long recruiter, Requests.Job input) {
    // Serialize company creation for one recruiter without changing the existing schema.
    db.queryForList("SELECT id FROM users WHERE id=? FOR UPDATE", recruiter);
    var rows =
        db.queryForList(
            "SELECT id FROM companies WHERE recruiter_id=? ORDER BY id LIMIT 1", recruiter);
    if (!rows.isEmpty()) {
      long id = ((Number) rows.getFirst().get("id")).longValue();
      if (input.companyName() != null && !input.companyName().isBlank())
        db.update(
            "UPDATE companies SET name=?,website=?,location=?,description=? WHERE id=?",
            input.companyName(),
            input.companyWebsite(),
            input.companyLocation(),
            input.companyDescription(),
            id);
      return id;
    }
    return insert(
        "INSERT INTO companies (recruiter_id,name,website,location,description) VALUES (?,?,?,?,?)",
        recruiter,
        fallback(input.companyName(), "My Company"),
        input.companyWebsite(),
        fallback(input.companyLocation(), input.location()),
        input.companyDescription());
  }

  public void deleteJob(long id, long user, boolean admin) {
    int count =
        admin
            ? db.update("DELETE FROM jobs WHERE id=?", id)
            : db.update("DELETE FROM jobs WHERE id=? AND recruiter_id=?", id, user);
    if (count == 0) throw new ApiException(404, "Job not found or not allowed");
  }

  public Map<String, Object> profile(long user) {
    var rows = db.queryForList("SELECT * FROM profiles WHERE user_id=?", user);
    return rows.isEmpty() ? null : rows.getFirst();
  }

  @Transactional
  public Map<String, Object> saveProfile(long user, Requests.Profile input) {
    db.queryForList("SELECT id FROM users WHERE id=? FOR UPDATE", user);
    Object[] values = {
      input.phone(),
      input.department(),
      input.graduationYear(),
      input.cgpa(),
      input.skills(),
      input.resumeUrl(),
      input.bio(),
      user
    };
    if (profile(user) == null)
      db.update(
          "INSERT INTO profiles"
              + " (phone,department,graduation_year,cgpa,skills,resume_url,bio,user_id) VALUES"
              + " (?,?,?,?,?,?,?,?)",
          values);
    else
      db.update(
          "UPDATE profiles SET"
              + " phone=?,department=?,graduation_year=?,cgpa=?,skills=?,resume_url=?,bio=? WHERE"
              + " user_id=?",
          values);
    return profile(user);
  }

  @Transactional
  public Map<String, Object> apply(long user, Requests.Application input) {
    Map<String, Object> job =
        one(
            "SELECT id,status,deadline FROM jobs WHERE id=? FOR UPDATE",
            "Job not found",
            input.jobId());
    if (!"open".equals(job.get("status"))) throw new ApiException(400, "This job is closed");
    if (((java.sql.Date) job.get("deadline"))
        .toLocalDate()
        .isBefore(java.time.LocalDate.now(java.time.ZoneOffset.UTC)))
      throw new ApiException(400, "The application deadline has passed");
    try {
      long id =
          insert(
              "INSERT INTO applications (job_id,student_id,cover_letter) VALUES (?,?,?)",
              input.jobId(),
              user,
              input.coverLetter());
      return one(APPLICATION + " WHERE applications.id=?", "Application not found", id);
    } catch (DuplicateKeyException ex) {
      throw new ApiException(409, "You have already applied for this job");
    }
  }

  public List<Map<String, Object>> applications(long user, boolean recruiter) {
    if (recruiter)
      return db.queryForList(
          "SELECT applications.*,users.name AS student_name,users.email AS"
              + " student_email,profiles.department,profiles.cgpa,profiles.skills,jobs.title AS"
              + " job_title FROM applications JOIN jobs ON jobs.id=applications.job_id JOIN users"
              + " ON users.id=applications.student_id LEFT JOIN profiles ON"
              + " profiles.user_id=users.id WHERE jobs.recruiter_id=? ORDER BY"
              + " applications.applied_at DESC",
          user);
    return db.queryForList(
        "SELECT applications.*,jobs.title,jobs.location,jobs.salary,companies.name AS company_name"
            + " FROM applications JOIN jobs ON jobs.id=applications.job_id JOIN companies ON"
            + " companies.id=jobs.company_id WHERE applications.student_id=? ORDER BY"
            + " applications.applied_at DESC",
        user);
  }

  public List<Map<String, Object>> users() {
    return db.queryForList(
        "SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC");
  }

  public void deleteUser(long id) {
    if (db.update("DELETE FROM users WHERE id=?", id) == 0)
      throw new ApiException(404, "User not found");
  }

  private Map<String, Object> one(String sql, String message, Object... args) {
    var rows = db.queryForList(sql, args);
    if (rows.isEmpty()) throw new ApiException(404, message);
    return rows.getFirst();
  }

  private long insert(String sql, Object... args) {
    KeyHolder keys = new GeneratedKeyHolder();
    db.update(
        connection -> {
          PreparedStatement statement = connection.prepareStatement(sql, new String[] {"id"});
          for (int i = 0; i < args.length; i++) statement.setObject(i + 1, args[i]);
          return statement;
        },
        keys);
    return Objects.requireNonNull(keys.getKey()).longValue();
  }

  private static String fallback(String value, String fallback) {
    return value == null || value.isBlank() ? fallback : value;
  }
}

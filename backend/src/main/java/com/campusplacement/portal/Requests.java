package com.campusplacement.portal;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public final class Requests {
  private Requests() {}

  public record Register(
      @NotBlank @Size(max = 100) String name,
      @NotBlank @Email @Size(max = 150) String email,
      @NotBlank @Size(min = 8, max = 72) String password,
      @NotNull @Pattern(regexp = "student|recruiter") String role) {}

  public record Login(@NotBlank @Email String email, @NotBlank String password) {}

  public record Profile(
      @Size(max = 20) String phone,
      @Size(max = 100) String department,
      @Min(1900) @Max(2200) Integer graduationYear,
      @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal cgpa,
      @Size(max = 5000) String skills,
      @Pattern(regexp = "^$|https?://[^\\s]+", message = "must be an HTTP or HTTPS URL")
          @Size(max = 255)
          String resumeUrl,
      @Size(max = 5000) String bio) {}

  public record Job(
      @Size(max = 150) String companyName,
      @Size(max = 255) String companyWebsite,
      @Size(max = 120) String companyLocation,
      String companyDescription,
      @NotBlank @Size(max = 150) String title,
      @NotBlank @Size(max = 20000) String description,
      @NotBlank @Size(max = 120) String location,
      @Size(max = 80) String salary,
      @Pattern(regexp = "internship|full-time|part-time") String jobType,
      String eligibilityCriteria,
      @NotNull LocalDate deadline,
      @Pattern(regexp = "open|closed") String status) {}

  public record Application(@NotNull @Positive Long jobId, @Size(max = 10000) String coverLetter) {}

  public record ApplicationStatus(
      @NotNull @Pattern(regexp = "applied|shortlisted|rejected|selected") String status) {}
}

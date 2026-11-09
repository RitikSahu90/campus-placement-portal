package com.campusplacement.portal;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PortalController {
  private final AuthService auth;
  private final PortalService portal;

  public PortalController(AuthService auth, PortalService portal) {
    this.auth = auth;
    this.portal = portal;
  }

  @GetMapping("/health")
  public ApiResponse health() {
    return ApiResponse.ok("Campus Placement Portal API is running", null);
  }

  @PostMapping("/auth/register")
  @ResponseStatus(HttpStatus.CREATED)
  public ApiResponse register(@Valid @RequestBody Requests.Register input) {
    return ApiResponse.ok("Registration successful", auth.register(input));
  }

  @PostMapping("/auth/login")
  public ApiResponse login(@Valid @RequestBody Requests.Login input) {
    return ApiResponse.ok("Login successful", auth.login(input));
  }

  @GetMapping("/auth/me")
  public ApiResponse me(@AuthenticationPrincipal Jwt jwt) {
    return ApiResponse.ok("Current user fetched", auth.user(id(jwt)));
  }

  @GetMapping("/profile")
  public ApiResponse profile(@AuthenticationPrincipal Jwt jwt) {
    return ApiResponse.ok("Profile fetched", portal.profile(id(jwt)));
  }

  @PutMapping("/profile")
  public ApiResponse profile(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody Requests.Profile input) {
    return ApiResponse.ok("Profile updated", portal.saveProfile(id(jwt), input));
  }

  @GetMapping("/jobs")
  public ApiResponse jobs() {
    return ApiResponse.ok("Jobs fetched", portal.jobs());
  }

  @GetMapping("/jobs/{id}")
  public ApiResponse job(@PathVariable long id) {
    return ApiResponse.ok("Job fetched", portal.job(id));
  }

  @PostMapping("/jobs")
  @ResponseStatus(HttpStatus.CREATED)
  public ApiResponse createJob(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody Requests.Job input) {
    return ApiResponse.ok("Job created", portal.createJob(id(jwt), input));
  }

  @PutMapping("/jobs/{id}")
  public ApiResponse updateJob(
      @AuthenticationPrincipal Jwt jwt,
      @PathVariable long id,
      @Valid @RequestBody Requests.Job input) {
    return ApiResponse.ok("Job updated", portal.updateJob(id, id(jwt), input));
  }

  @DeleteMapping("/jobs/{id}")
  public ApiResponse deleteJob(@AuthenticationPrincipal Jwt jwt, @PathVariable long id) {
    portal.deleteJob(id, id(jwt), is(jwt, "admin"));
    return ApiResponse.ok("Job deleted", null);
  }

  @PostMapping("/applications")
  @ResponseStatus(HttpStatus.CREATED)
  public ApiResponse apply(
      @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody Requests.Application input) {
    return ApiResponse.ok("Application submitted", portal.apply(id(jwt), input));
  }

  @GetMapping("/applications")
  public ApiResponse applications(@AuthenticationPrincipal Jwt jwt) {
    return ApiResponse.ok(
        "Applications fetched", portal.applications(id(jwt), is(jwt, "recruiter")));
  }

  @GetMapping("/users")
  public ApiResponse users() {
    return ApiResponse.ok("Users fetched", portal.users());
  }

  @DeleteMapping("/users/{id}")
  public ApiResponse deleteUser(@PathVariable long id) {
    portal.deleteUser(id);
    return ApiResponse.ok("User deleted", null);
  }

  private long id(Jwt jwt) {
    return ((Number) jwt.getClaim("id")).longValue();
  }

  private boolean is(Jwt jwt, String role) {
    return role.equals(jwt.getClaimAsString("role"));
  }
}

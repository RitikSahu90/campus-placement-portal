package com.campusplacement.portal;

import org.springframework.boot.SpringApplication;

/** Manual browser verification with isolated, disposable test data. */
public class DemoServer {
  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(PlacementPortalApplication.class);
    app.setAdditionalProfiles("test");
    app.run(args);
  }
}

package com.campusplacement.portal;

public record ApiResponse(boolean success, String message, Object data) {
  public static ApiResponse ok(String message, Object data) {
    return new ApiResponse(true, message, data);
  }
}

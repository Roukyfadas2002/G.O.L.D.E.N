package com.src.backend.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String role;
    private String username;

    // ✅ Constructeur avec paramètres
    public LoginResponse(boolean success, String message, String role, String username) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.username = username;
    }

    // ✅ Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public String getRole() { return role; }
    public String getUsername() { return username; }
}

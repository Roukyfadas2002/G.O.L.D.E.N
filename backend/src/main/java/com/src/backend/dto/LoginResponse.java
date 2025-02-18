package com.src.backend.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String role;
    private String username;
    private Long clientId; // ✅ Ajout de l'ID du client

    public LoginResponse(boolean success, String message, String role, String username, Long clientId) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.username = username;
        this.clientId = clientId;
    }

    // ✅ Getters et Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
}
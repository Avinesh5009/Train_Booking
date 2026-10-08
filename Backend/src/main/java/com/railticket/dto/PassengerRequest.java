package com.railticket.dto;
import jakarta.validation.constraints.*;
public record PassengerRequest(
        @NotBlank String fullName,
        @Min(1) @Max(120) int age,
        @NotBlank String gender,
        @NotBlank String berthPreference,
        @NotBlank String foodChoice,
        String assignedCoach,
        String assignedSeat,
        String assignedBerthType) {}

package com.railticket.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;
public record BookingRequest(
        @NotBlank String trainNumber,
        @NotNull @FutureOrPresent LocalDate journeyDate,
        @NotBlank String classCode,
        @NotBlank String quota,
        @NotEmpty @Size(max=6) List<@Valid PassengerRequest> passengers,
        @NotBlank @Email String contactEmail,
        @NotBlank @Pattern(regexp="^[0-9+ ()-]{8,20}$") String contactPhone,
        String paymentMethod) {}

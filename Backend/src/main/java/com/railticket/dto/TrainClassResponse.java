package com.railticket.dto;
import java.math.BigDecimal;
public record TrainClassResponse(String code, String name, String status, Integer seatsAvailable, BigDecimal basePrice, String coachCode) {}

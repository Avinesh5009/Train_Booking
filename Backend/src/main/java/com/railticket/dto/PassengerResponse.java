package com.railticket.dto;
public record PassengerResponse(String id, String fullName, Integer age, String gender, String berthPreference,
                                String foodChoice, String assignedCoach, String assignedSeat, String assignedBerthType) {}

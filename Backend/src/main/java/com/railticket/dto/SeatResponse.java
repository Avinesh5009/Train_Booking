package com.railticket.dto;
public record SeatResponse(String seatNumber, String berthType, String coachCode, boolean booked, String bookedBy) {}

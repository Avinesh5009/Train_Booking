package com.railticket.dto;
import java.math.BigDecimal;
import java.time.*;
import java.util.List;
public record BookingResponse(
        String id, String pnr, String trainNumber, String trainName, String trainType,
        String originCode, String originName, String destinationCode, String destinationName,
        LocalDate journeyDate, String departureTime, String arrivalTime, String duration,
        String classCode, String className, String quota, List<PassengerResponse> passengers,
        String contactEmail, String contactPhone, BigDecimal baseFare, BigDecimal reservationFee,
        BigDecimal tax, BigDecimal insuranceFee, BigDecimal totalFare, String paymentMethod,
        String transactionId, String status, OffsetDateTime bookedAt, OffsetDateTime cancelledAt,
        BigDecimal refundAmount, Integer platformNumber) {}

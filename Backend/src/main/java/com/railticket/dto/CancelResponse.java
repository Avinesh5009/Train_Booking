package com.railticket.dto;
import java.math.BigDecimal;
public record CancelResponse(String pnr, String status, BigDecimal originalFare, BigDecimal cancellationFee,
                             BigDecimal refundAmount, String message) {}

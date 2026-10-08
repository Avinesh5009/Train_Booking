package com.railticket.dto;
import java.time.OffsetDateTime;
public record LiveTrainResponse(Long trainId, String trainNumber, String trainName, String currentStationCode,
                                String currentStationName, String nextStationCode, String nextStationName,
                                String status, int delayMinutes, OffsetDateTime updatedAt) {}

package com.railticket.dto;
public record TrainStopResponse(String stationCode, String stationName, String arrivalTime, String departureTime,
                                Integer haltMinutes, Integer distanceKm, Integer day, Integer platform) {}

package com.railticket.dto;
import java.util.List;
import java.util.Set;
public record TrainResponse(Long id, String number, String name, String type,
                            StationResponse origin, StationResponse destination,
                            String departureTime, String arrivalTime, String duration,
                            Set<Integer> runsOnDays, List<TrainClassResponse> classes,
                            List<TrainStopResponse> stops, Integer totalDistanceKm,
                            boolean pantryAvailable, Double cleanlinessRating) {}

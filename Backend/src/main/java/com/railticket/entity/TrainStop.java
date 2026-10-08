package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="train_stops")
@Getter @Setter @NoArgsConstructor
public class TrainStop {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="train_id") private Train train;
    @ManyToOne(optional=false, fetch=FetchType.EAGER) @JoinColumn(name="station_id") private Station station;
    private String arrivalTime;
    private String departureTime;
    private Integer haltMinutes;
    private Integer distanceKm;
    private Integer day;
    private Integer platform;
}

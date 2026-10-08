package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity @Table(name="trains")
@Getter @Setter @NoArgsConstructor
public class Train {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true, length=20) private String number;
    @Column(nullable=false) private String name;
    @Enumerated(EnumType.STRING) @Column(nullable=false, length=40) private TrainType type;
    @ManyToOne(optional=false, fetch=FetchType.EAGER) @JoinColumn(name="origin_station_id") private Station origin;
    @ManyToOne(optional=false, fetch=FetchType.EAGER) @JoinColumn(name="destination_station_id") private Station destination;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private Integer totalDistanceKm;
    private boolean pantryAvailable;
    private Double cleanlinessRating;
    @ElementCollection @CollectionTable(name="train_operating_days", joinColumns=@JoinColumn(name="train_id"))
    @Column(name="day_of_week") private Set<Integer> runsOnDays = new HashSet<>();
}

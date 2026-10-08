package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="passengers")
@Getter @Setter @NoArgsConstructor
public class Passenger {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="booking_id") private Booking booking;
    @Column(nullable=false) private String fullName;
    @Column(nullable=false) private Integer age;
    @Column(nullable=false, length=10) private String gender;
    @Column(nullable=false) private String berthPreference;
    @Column(nullable=false) private String foodChoice;
    private String assignedCoach;
    private String assignedSeat;
    private String assignedBerthType;
}

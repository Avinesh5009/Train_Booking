package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name="seat_reservations",
        uniqueConstraints=@UniqueConstraint(columnNames={"train_id","journey_date","class_code","coach_code","seat_number"}))
@Getter @Setter @NoArgsConstructor
public class SeatReservation {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="train_id") private Train train;
    @Column(name="journey_date", nullable=false) private LocalDate journeyDate;
    @Column(name="class_code", nullable=false) private String classCode;
    @Column(name="coach_code", nullable=false) private String coachCode;
    @Column(name="seat_number", nullable=false) private String seatNumber;
    private String berthType;
    @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="passenger_id") private Passenger passenger;
}

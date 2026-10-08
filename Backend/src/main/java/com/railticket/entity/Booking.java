package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity @Table(name="bookings")
@Getter @Setter @NoArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @Column(nullable=false, unique=true, length=20) private String pnr;
    @ManyToOne(optional=false, fetch=FetchType.EAGER) @JoinColumn(name="train_id") private Train train;
    @Column(nullable=false) private LocalDate journeyDate;
    @Column(nullable=false) private String classCode;
    @Column(nullable=false) private String className;
    @Column(nullable=false) private String quota;
    @Column(nullable=false) private String contactEmail;
    @Column(nullable=false) private String contactPhone;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal baseFare;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal reservationFee;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal tax;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal insuranceFee;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal totalFare;
    private String paymentMethod;
    private String transactionId;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private BookingStatus status;
    private OffsetDateTime bookedAt;
    private OffsetDateTime cancelledAt;
    @Column(precision=12, scale=2) private BigDecimal refundAmount;
    private Integer platformNumber;

    @OneToMany(mappedBy="booking", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<Passenger> passengers = new ArrayList<>();
}

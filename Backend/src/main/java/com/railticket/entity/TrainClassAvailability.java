package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity @Table(name="train_class_availability",
        uniqueConstraints=@UniqueConstraint(columnNames={"train_id","class_code"}))
@Getter @Setter @NoArgsConstructor
public class TrainClassAvailability {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false, fetch=FetchType.LAZY) @JoinColumn(name="train_id") private Train train;
    @Column(name="class_code", nullable=false, length=10) private String classCode;
    @Column(nullable=false) private String className;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private AvailabilityStatus status;
    private Integer seatsAvailable;
    @Column(precision=12, scale=2, nullable=false) private BigDecimal basePrice;
    @Column(nullable=false) private String coachCode;
}

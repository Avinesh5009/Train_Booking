package com.railticket.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name="stations")
@Getter @Setter @NoArgsConstructor
public class Station {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true, length=10) private String code;
    @Column(nullable=false) private String name;
    @Column(nullable=false) private String city;
    @Column(nullable=false) private String state;
    private Integer platforms;
}

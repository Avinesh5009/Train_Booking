package com.railticket.repository;
import com.railticket.entity.SeatReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.*;
public interface SeatReservationRepository extends JpaRepository<SeatReservation, Long> {
    List<SeatReservation> findByTrainIdAndJourneyDateAndClassCode(Long trainId, LocalDate date, String classCode);
    boolean existsByTrainIdAndJourneyDateAndClassCodeAndCoachCodeAndSeatNumber(Long trainId, LocalDate date, String classCode, String coach, String seat);
}

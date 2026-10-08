package com.railticket.repository;
import com.railticket.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface BookingRepository extends JpaRepository<Booking, String> {
    Optional<Booking> findByPnr(String pnr);
    List<Booking> findAllByOrderByBookedAtDesc();
}

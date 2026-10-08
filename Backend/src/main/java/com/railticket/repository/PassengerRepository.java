package com.railticket.repository;
import com.railticket.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PassengerRepository extends JpaRepository<Passenger, String> {}

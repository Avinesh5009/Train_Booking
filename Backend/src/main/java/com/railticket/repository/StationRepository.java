package com.railticket.repository;
import com.railticket.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface StationRepository extends JpaRepository<Station, Long> {
    Optional<Station> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);
}

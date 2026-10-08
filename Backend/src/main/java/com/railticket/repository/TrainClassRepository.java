package com.railticket.repository;
import com.railticket.entity.TrainClassAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TrainClassRepository extends JpaRepository<TrainClassAvailability, Long> {
    List<TrainClassAvailability> findByTrainId(Long trainId);
    Optional<TrainClassAvailability> findByTrainIdAndClassCode(Long trainId, String classCode);
}

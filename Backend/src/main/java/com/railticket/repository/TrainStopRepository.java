package com.railticket.repository;
import com.railticket.entity.TrainStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TrainStopRepository extends JpaRepository<TrainStop, Long> {
    List<TrainStop> findByTrainIdOrderByDayAscDistanceKmAsc(Long trainId);
}

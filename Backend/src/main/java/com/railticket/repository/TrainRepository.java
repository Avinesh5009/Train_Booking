package com.railticket.repository;
import com.railticket.entity.Train;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
public interface TrainRepository extends JpaRepository<Train, Long> {
    Optional<Train> findByNumber(String number);
    @Query("select t from Train t where upper(t.origin.code)=upper(:from) and upper(t.destination.code)=upper(:to)")
    List<Train> search(@Param("from") String from, @Param("to") String to);
}

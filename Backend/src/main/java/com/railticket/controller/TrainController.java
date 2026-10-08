package com.railticket.controller;
import com.railticket.dto.*;
import com.railticket.service.RailwayService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/trains") @RequiredArgsConstructor
public class TrainController {
    private final RailwayService service;

    @GetMapping("/search")
    public List<TrainResponse> search(@RequestParam String from, @RequestParam String to,
                                      @RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.searchTrains(from, to, date);
    }
    @GetMapping("/{id}") public TrainResponse get(@PathVariable Long id) { return service.getTrain(id); }
    @GetMapping("/{id}/classes") public List<TrainClassResponse> classes(@PathVariable Long id) { return service.classes(id); }
    @GetMapping("/{id}/schedule") public List<TrainStopResponse> schedule(@PathVariable Long id) { return service.schedule(id); }
    @GetMapping("/{id}/classes/{classCode}/seats")
    public List<SeatResponse> seats(@PathVariable Long id, @PathVariable String classCode,
                                    @RequestParam @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.seats(id, classCode, date);
    }
    @GetMapping("/{id}/live") public LiveTrainResponse live(@PathVariable Long id) { return service.live(id); }
}

package com.railticket.controller;
import com.railticket.dto.StationResponse;
import com.railticket.service.RailwayService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/stations") @RequiredArgsConstructor
public class StationController {
    private final RailwayService service;
    @GetMapping public List<StationResponse> all(@RequestParam(required=false) String q) { return service.stations(q); }
}

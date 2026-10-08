package com.railticket.controller;
import com.railticket.dto.*;
import com.railticket.service.RailwayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/bookings") @RequiredArgsConstructor
public class BookingController {
    private final RailwayService service;
    @PostMapping public BookingResponse create(@Valid @RequestBody BookingRequest request) { return service.createBooking(request); }
    @GetMapping public List<BookingResponse> all() { return service.allBookings(); }
    @GetMapping("/pnr/{pnr}") public BookingResponse byPnr(@PathVariable String pnr) { return service.bookingByPnr(pnr); }
    @GetMapping("/{id}") public BookingResponse byId(@PathVariable String id) { return service.bookingById(id); }
    @PostMapping("/{id}/cancel") public CancelResponse cancel(@PathVariable String id) { return service.cancel(id); }
}

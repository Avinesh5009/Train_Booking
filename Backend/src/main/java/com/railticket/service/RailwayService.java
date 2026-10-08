package com.railticket.service;

import com.railticket.dto.*;
import com.railticket.entity.*;
import com.railticket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RailwayService {
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final TrainStopRepository trainStopRepository;
    private final BookingRepository bookingRepository;
    private final SeatReservationRepository seatReservationRepository;

    @Value("${app.booking.cancellation-fee-per-passenger:120}")
    private BigDecimal cancellationFeePerPassenger;

    public List<StationResponse> stations(String q) {
        return stationRepository.findAll().stream()
                .filter(s -> q == null || q.isBlank() ||
                        s.getCode().equalsIgnoreCase(q) ||
                        s.getCity().toLowerCase().contains(q.toLowerCase()) ||
                        s.getName().toLowerCase().contains(q.toLowerCase()))
                .sorted(Comparator.comparing(Station::getCity))
                .map(this::station)
                .toList();
    }

    public List<TrainResponse> searchTrains(String from, String to, LocalDate date) {
        if (from.equalsIgnoreCase(to)) throw new IllegalArgumentException("Origin and destination must be different.");
        int day = date.getDayOfWeek().getValue() % 7;
        return trainRepository.search(from, to).stream()
                .filter(t -> t.getRunsOnDays().contains(day))
                .map(this::train)
                .toList();
    }

    @Transactional(readOnly=true)
    public TrainResponse getTrain(Long id) {
        return train(trainRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Train not found: " + id)));
    }

    @Transactional(readOnly=true)
    public List<TrainClassResponse> classes(Long trainId) {
        if (!trainRepository.existsById(trainId)) throw new NoSuchElementException("Train not found: " + trainId);
        return trainClassRepository.findByTrainId(trainId).stream().map(this::trainClass).toList();
    }

    @Transactional(readOnly=true)
    public List<TrainStopResponse> schedule(Long trainId) {
        if (!trainRepository.existsById(trainId)) throw new NoSuchElementException("Train not found: " + trainId);
        return trainStopRepository.findByTrainIdOrderByDayAscDistanceKmAsc(trainId).stream().map(this::stop).toList();
    }

    @Transactional(readOnly=true)
    public List<SeatResponse> seats(Long trainId, String classCode, LocalDate date) {
        Train train = trainRepository.findById(trainId).orElseThrow(() -> new NoSuchElementException("Train not found"));
        TrainClassAvailability c = trainClassRepository.findByTrainIdAndClassCode(trainId, classCode)
                .orElseThrow(() -> new NoSuchElementException("Class not found: " + classCode));
        Set<String> booked = seatReservationRepository.findByTrainIdAndJourneyDateAndClassCode(trainId, date, classCode)
                .stream().map(SeatReservation::getSeatNumber).collect(Collectors.toSet());
        int total = Set.of("CC","EC").contains(classCode) ? 40 : 32;
        List<SeatResponse> result = new ArrayList<>();
        for (int i=1; i<=total; i++) {
            String berth = berthType(classCode, i);
            result.add(new SeatResponse(String.valueOf(i), berth, c.getCoachCode(), booked.contains(String.valueOf(i)), null));
        }
        return result;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Train train = trainRepository.findByNumber(request.trainNumber())
                .orElseThrow(() -> new NoSuchElementException("Train not found: " + request.trainNumber()));
        TrainClassAvailability clazz = trainClassRepository.findByTrainIdAndClassCode(train.getId(), request.classCode())
                .orElseThrow(() -> new NoSuchElementException("Class not available: " + request.classCode()));

        if (request.journeyDate().isBefore(LocalDate.now()))
            throw new IllegalArgumentException("Journey date cannot be in the past.");
        if (request.passengers().size() > clazz.getSeatsAvailable())
            throw new IllegalArgumentException("Not enough seats available.");

        int day = request.journeyDate().getDayOfWeek().getValue() % 7;
        if (!train.getRunsOnDays().contains(day))
            throw new IllegalArgumentException("Train does not operate on the selected date.");

        Booking b = new Booking();
        b.setPnr(generatePnr());
        b.setTrain(train);
        b.setJourneyDate(request.journeyDate());
        b.setClassCode(clazz.getClassCode());
        b.setClassName(clazz.getClassName());
        b.setQuota(request.quota());
        b.setContactEmail(request.contactEmail());
        b.setContactPhone(request.contactPhone());
        BigDecimal base = clazz.getBasePrice().multiply(BigDecimal.valueOf(request.passengers().size()));
        BigDecimal reservation = BigDecimal.valueOf(40L * request.passengers().size());
        BigDecimal tax = base.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);
        b.setBaseFare(base); b.setReservationFee(reservation); b.setTax(tax);
        b.setInsuranceFee(BigDecimal.ZERO); b.setTotalFare(base.add(reservation).add(tax));
        b.setPaymentMethod(request.paymentMethod() == null ? "UPI - Demo" : request.paymentMethod());
        b.setTransactionId("TXN-" + (1000000000L + new Random().nextInt(900000000)));
        b.setStatus(BookingStatus.CONFIRMED); b.setBookedAt(OffsetDateTime.now(ZoneOffset.UTC));
        b.setPlatformNumber(trainStopRepository.findByTrainIdOrderByDayAscDistanceKmAsc(train.getId()).get(0).getPlatform());

        Set<String> taken = seatReservationRepository.findByTrainIdAndJourneyDateAndClassCode(train.getId(), request.journeyDate(), request.classCode())
                .stream().map(SeatReservation::getSeatNumber).collect(Collectors.toSet());

        for (int i=0; i<request.passengers().size(); i++) {
            PassengerRequest pr = request.passengers().get(i);
            String seat = pr.assignedSeat();
            if (seat == null || seat.isBlank() || taken.contains(seat)) seat = nextFreeSeat(taken, Set.of("CC","EC").contains(request.classCode()) ? 40 : 32);
            if (seat == null) throw new IllegalArgumentException("No free seats remain.");
            taken.add(seat);

            Passenger p = new Passenger();
            p.setBooking(b); p.setFullName(pr.fullName()); p.setAge(pr.age()); p.setGender(pr.gender());
            p.setBerthPreference(pr.berthPreference()); p.setFoodChoice(pr.foodChoice());
            p.setAssignedCoach(clazz.getCoachCode()); p.setAssignedSeat(seat);
            p.setAssignedBerthType(berthType(request.classCode(), Integer.parseInt(seat)));
            b.getPassengers().add(p);
        }

        clazz.setSeatsAvailable(clazz.getSeatsAvailable() - request.passengers().size());
        trainClassRepository.save(clazz);
        Booking saved = bookingRepository.save(b);

        for (Passenger p : saved.getPassengers()) {
            SeatReservation sr = new SeatReservation();
            sr.setTrain(train); sr.setJourneyDate(saved.getJourneyDate()); sr.setClassCode(saved.getClassCode());
            sr.setCoachCode(clazz.getCoachCode()); sr.setSeatNumber(p.getAssignedSeat()); sr.setBerthType(p.getAssignedBerthType());
            sr.setPassenger(p);
            try { seatReservationRepository.save(sr); }
            catch (DataIntegrityViolationException ex) { throw new IllegalArgumentException("Seat was just booked by another user. Please retry."); }
        }
        return booking(saved);
    }

    @Transactional(readOnly=true)
    public List<BookingResponse> allBookings() {
        return bookingRepository.findAllByOrderByBookedAtDesc().stream().map(this::booking).toList();
    }

    @Transactional(readOnly=true)
    public BookingResponse bookingById(String id) {
        return booking(bookingRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Booking not found: " + id)));
    }

    @Transactional(readOnly=true)
    public BookingResponse bookingByPnr(String pnr) {
        return booking(bookingRepository.findByPnr(pnr.trim()).orElseThrow(() -> new NoSuchElementException("No booking found for PNR: " + pnr)));
    }

    @Transactional
    public CancelResponse cancel(String id) {
        Booking b = bookingRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Booking not found: " + id));
        if (b.getStatus() == BookingStatus.CANCELLED)
            return new CancelResponse(b.getPnr(), "CANCELLED", b.getTotalFare(), BigDecimal.ZERO, b.getRefundAmount(), "Booking was already cancelled.");

        BigDecimal fee = cancellationFeePerPassenger.multiply(BigDecimal.valueOf(b.getPassengers().size()));
        BigDecimal refund = b.getTotalFare().subtract(fee).max(BigDecimal.ZERO);
        b.setStatus(BookingStatus.CANCELLED); b.setCancelledAt(OffsetDateTime.now(ZoneOffset.UTC)); b.setRefundAmount(refund);
        b.getPassengers().forEach(p -> {});
        trainClassRepository.findByTrainIdAndClassCode(b.getTrain().getId(), b.getClassCode()).ifPresent(c -> {
            c.setSeatsAvailable(c.getSeatsAvailable() + b.getPassengers().size());
            trainClassRepository.save(c);
        });
        seatReservationRepository.findByTrainIdAndJourneyDateAndClassCode(b.getTrain().getId(), b.getJourneyDate(), b.getClassCode())
                .stream().filter(sr -> b.getPassengers().contains(sr.getPassenger())).forEach(seatReservationRepository::delete);
        bookingRepository.save(b);
        return new CancelResponse(b.getPnr(), "CANCELLED", b.getTotalFare(), fee, refund, "Booking cancelled. Refund amount calculated successfully.");
    }

    public LiveTrainResponse live(Long trainId) {
        Train t = trainRepository.findById(trainId).orElseThrow(() -> new NoSuchElementException("Train not found"));
        List<TrainStop> stops = trainStopRepository.findByTrainIdOrderByDayAscDistanceKmAsc(trainId);
        TrainStop current = stops.get(0);
        TrainStop next = stops.size() > 1 ? stops.get(1) : stops.get(0);
        return new LiveTrainResponse(t.getId(), t.getNumber(), t.getName(),
                current.getStation().getCode(), current.getStation().getName(),
                next.getStation().getCode(), next.getStation().getName(),
                "ON_TIME", 0, OffsetDateTime.now(ZoneOffset.UTC));
    }

    private String nextFreeSeat(Set<String> taken, int total) {
        for (int i=1;i<=total;i++) if (!taken.contains(String.valueOf(i)) && !Set.of(3,4,8,11,12,17,21,22,29).contains(i))
            return String.valueOf(i);
        return null;
    }

    private String berthType(String classCode, int n) {
        if (Set.of("CC","EC").contains(classCode)) return (n % 4 == 1 || n % 4 == 0) ? "Window" : "Aisle";
        int mod = n % 8;
        if (mod == 1 || mod == 4) return "Lower";
        if (mod == 2 || mod == 5) return "Middle";
        if (mod == 3 || mod == 6) return "Upper";
        return mod == 7 ? "Side Lower" : "Side Upper";
    }

    private TrainResponse train(Train t) {
        List<TrainClassResponse> classes = trainClassRepository.findByTrainId(t.getId()).stream().map(this::trainClass).toList();
        List<TrainStopResponse> stops = trainStopRepository.findByTrainIdOrderByDayAscDistanceKmAsc(t.getId()).stream().map(this::stop).toList();
        return new TrainResponse(t.getId(),t.getNumber(),t.getName(),t.getType().name(),station(t.getOrigin()),station(t.getDestination()),
                t.getDepartureTime(),t.getArrivalTime(),t.getDuration(),t.getRunsOnDays(),classes,stops,t.getTotalDistanceKm(),t.isPantryAvailable(),t.getCleanlinessRating());
    }
    private StationResponse station(Station s) { return new StationResponse(s.getId(),s.getCode(),s.getName(),s.getCity(),s.getState(),s.getPlatforms()); }
    private TrainClassResponse trainClass(TrainClassAvailability c) { return new TrainClassResponse(c.getClassCode(),c.getClassName(),c.getStatus().name(),c.getSeatsAvailable(),c.getBasePrice(),c.getCoachCode()); }
    private TrainStopResponse stop(TrainStop s) { return new TrainStopResponse(s.getStation().getCode(),s.getStation().getName(),s.getArrivalTime(),s.getDepartureTime(),s.getHaltMinutes(),s.getDistanceKm(),s.getDay(),s.getPlatform()); }
    private BookingResponse booking(Booking b) {
        List<PassengerResponse> ps = b.getPassengers().stream().map(p -> new PassengerResponse(p.getId(),p.getFullName(),p.getAge(),p.getGender(),p.getBerthPreference(),p.getFoodChoice(),p.getAssignedCoach(),p.getAssignedSeat(),p.getAssignedBerthType())).toList();
        Train t=b.getTrain();
        return new BookingResponse(b.getId(),b.getPnr(),t.getNumber(),t.getName(),t.getType().name(),
                t.getOrigin().getCode(),t.getOrigin().getName(),t.getDestination().getCode(),t.getDestination().getName(),
                b.getJourneyDate(),t.getDepartureTime(),t.getArrivalTime(),t.getDuration(),b.getClassCode(),b.getClassName(),b.getQuota(),ps,
                b.getContactEmail(),b.getContactPhone(),b.getBaseFare(),b.getReservationFee(),b.getTax(),b.getInsuranceFee(),b.getTotalFare(),
                b.getPaymentMethod(),b.getTransactionId(),b.getStatus().name(),b.getBookedAt(),b.getCancelledAt(),b.getRefundAmount(),b.getPlatformNumber());
    }
}

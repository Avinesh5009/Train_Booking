package com.railticket.config;

import com.railticket.entity.*;
import com.railticket.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final StationRepository stationRepository;
    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final TrainStopRepository trainStopRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (stationRepository.count() > 0) return;

        Station hyb = station("HYB", "Hyderabad Deccan", "Hyderabad", "Telangana", 6);
        Station mas = station("MAS", "Chennai Central", "Chennai", "Tamil Nadu", 12);
        Station sc = station("SC", "Secunderabad Junction", "Hyderabad", "Telangana", 10);
        Station gnt = station("GNT", "Guntur Junction", "Guntur", "Andhra Pradesh", 7);
        Station ogl = station("OGL", "Ongole", "Ongole", "Andhra Pradesh", 4);
        Station nlr = station("NLR", "Nellore", "Nellore", "Andhra Pradesh", 5);
        Station nlda = station("NLDA", "Nalgonda", "Nalgonda", "Telangana", 3);
        Station ndls = station("NDLS", "New Delhi Railway Station", "New Delhi", "Delhi", 16);
        Station bsb = station("BSB", "Varanasi Junction", "Varanasi", "Uttar Pradesh", 9);
        Station mmct = station("MMCT", "Mumbai Central", "Mumbai", "Maharashtra", 7);
        Station pune = station("PUNE", "Pune Junction", "Pune", "Maharashtra", 6);
        Station lnl = station("LNL", "Lonavala", "Lonavala", "Maharashtra", 4);
        Station dr = station("DR", "Dadar Central", "Mumbai", "Maharashtra", 8);
        Station blr = station("SBC", "KSR Bengaluru", "Bengaluru", "Karnataka", 10);
        station("HWH", "Howrah Junction", "Kolkata", "West Bengal", 23);
        station("JP", "Jaipur Junction", "Jaipur", "Rajasthan", 8);
        station("ADI", "Ahmedabad Junction", "Ahmedabad", "Gujarat", 12);
        station("AGC", "Agra Cantt", "Agra", "Uttar Pradesh", 6);
        station("CNB", "Kanpur Central", "Kanpur", "Uttar Pradesh", 10);
        station("LKO", "Lucknow Charbagh", "Lucknow", "Uttar Pradesh", 9);
        station("BKN", "Bikaner Junction", "Bikaner", "Rajasthan", 5);
        station("ASR", "Amritsar Junction", "Amritsar", "Punjab", 8);
        station("CDG", "Chandigarh Junction", "Chandigarh", "Punjab / Haryana", 6);
        station("GKP", "Gorakhpur Junction", "Gorakhpur", "Uttar Pradesh", 10);
        station("BPL", "Bhopal Junction", "Bhopal", "Madhya Pradesh", 6);

        createTrain("12760", "Charminar Superfast Express", TrainType.SUPERFAST_EXPRESS,
                hyb, mas, "18:00", "07:55", "13h 55m", 790, true, 4.8,
                Set.of(0,1,2,3,4,5,6),
                List.of(
                        stop(hyb,"Start","18:00",0,0,1,5),
                        stop(sc,"18:20","18:25",5,10,1,1),
                        stop(gnt,"20:28","20:30",2,142,1,1),
                        stop(ogl,"02:18","02:20",2,497,2,3),
                        stop(nlr,"03:43","03:45",2,613,2,3),
                        stop(mas,"07:55","Ends",0,790,2,4)
                ),
                List.of(cls("1A","AC First Class",6,3180,"H1"), cls("2A","AC 2-Tier",24,1890,"A1"),
                        cls("3A","AC 3-Tier",68,1340,"B3"), cls("SL","Sleeper",122,495,"S4")));

        createTrain("12604", "Chennai Central SF Express", TrainType.SUPERFAST_EXPRESS,
                hyb, mas, "16:45", "05:40", "12h 55m", 715, true, 4.7,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(hyb,"Start","16:45",0,0,1,6), stop(sc,"17:05","17:10",5,10,1,2),
                        stop(gnt,"22:15","22:20",5,382,1,1), stop(mas,"05:40","Ends",0,715,2,3)),
                List.of(cls("2A","AC 2-Tier",18,1780,"A1"), cls("3A","AC 3-Tier",52,1260,"B2"),
                        cls("SL","Sleeper",98,465,"S3")));

        createTrain("20678", "Hyderabad - Chennai Vande Bharat", TrainType.VANDE_BHARAT,
                hyb, mas, "06:15", "14:30", "8h 15m", 715, true, 4.9,
                Set.of(0,1,2,3,5,6),
                List.of(stop(hyb,"Start","06:15",0,0,1,1), stop(nlda,"07:30","07:32",2,110,1,2),
                        stop(gnt,"10:00","10:05",5,382,1,1), stop(ogl,"11:28","11:30",2,497,1,3),
                        stop(mas,"14:30","Ends",0,715,1,2)),
                List.of(cls("EC","Executive Chair Car",24,2480,"E1"), cls("CC","AC Chair Car",88,1290,"C2")));

        createTrain("12759", "Charminar Superfast Express", TrainType.SUPERFAST_EXPRESS,
                mas, hyb, "18:10", "08:00", "13h 50m", 790, true, 4.8,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(mas,"Start","18:10",0,0,1,4), stop(nlr,"21:03","21:05",2,177,1,2),
                        stop(ogl,"22:33","22:35",2,293,1,1), stop(sc,"07:15","07:20",5,780,2,5),
                        stop(hyb,"08:00","Ends",0,790,2,5)),
                List.of(cls("1A","AC First Class",8,3180,"H1"), cls("2A","AC 2-Tier",28,1890,"A1"),
                        cls("3A","AC 3-Tier",74,1340,"B2"), cls("SL","Sleeper",110,495,"S2")));

        createTrain("12124", "Deccan Queen Superfast", TrainType.SUPERFAST_EXPRESS,
                pune, mmct, "07:15", "10:25", "3h 10m", 192, true, 4.9,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(pune,"Start","07:15",0,0,1,5), stop(lnl,"08:08","08:10",2,64,1,2),
                        stop(dr,"10:03","10:05",2,183,1,6), stop(mmct,"10:25","Ends",0,192,1,8)),
                List.of(cls("CC","AC Chair Car",124,480,"C1"), cls("2A","AC 2-Tier",32,750,"A1")));

        createTrain("20677", "Chennai - Hyderabad Vande Bharat", TrainType.VANDE_BHARAT,
                mas, hyb, "05:30", "13:45", "8h 15m", 715, true, 4.9,
                Set.of(0,1,2,4,5,6),
                List.of(stop(mas,"Start","05:30",0,0,1,2), stop(ogl,"08:38","08:40",2,218,1,1),
                        stop(gnt,"10:00","10:05",5,333,1,1), stop(nlda,"12:08","12:10",2,605,1,2),
                        stop(hyb,"13:45","Ends",0,715,1,1)),
                List.of(cls("EC","Executive Chair Car",28,2480,"E1"), cls("CC","AC Chair Car",96,1290,"C1")));

        createTrain("22436", "Vande Bharat Express", TrainType.VANDE_BHARAT,
                ndls, bsb, "06:00", "14:00", "8h 00m", 759, true, 4.9,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(ndls,"Start","06:00",0,0,1,16), stop(bsb,"14:00","Ends",0,759,1,4)),
                List.of(cls("CC","AC Chair Car",180,1475,"C3")));

        createTrain("12952", "Mumbai Rajdhani Express", TrainType.RAJDHANI_EXPRESS,
                ndls, mmct, "16:55", "08:35", "15h 40m", 1384, true, 4.8,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(ndls,"Start","16:55",0,0,1,3), stop(mmct,"08:35","Ends",0,1384,2,5)),
                List.of(cls("2A","AC 2-Tier",80,2890,"A2"), cls("3A","AC 3-Tier",120,2050,"B4")));

        createTrain("12627", "Karnataka Express", TrainType.SUPERFAST_EXPRESS,
                ndls, blr, "19:20", "06:30", "35h 10m", 2400, true, 4.5,
                Set.of(0,1,2,3,4,5,6),
                List.of(stop(ndls,"Start","19:20",0,0,1,8), stop(blr,"06:30","Ends",0,2400,2,5)),
                List.of(cls("2A","AC 2-Tier",36,2450,"A1"), cls("3A","AC 3-Tier",72,1650,"B2"),
                        cls("SL","Sleeper",160,610,"S5")));
    }

    private Station station(String code, String name, String city, String state, int platforms) {
        Station s = new Station();
        s.setCode(code); s.setName(name); s.setCity(city); s.setState(state); s.setPlatforms(platforms);
        return stationRepository.save(s);
    }

    private void createTrain(String number, String name, TrainType type, Station origin, Station destination,
                             String dep, String arr, String duration, int distance, boolean pantry, double rating,
                             Set<Integer> days, List<TrainStop> stops, List<TrainClassAvailability> classes) {
        Train t = new Train();
        t.setNumber(number); t.setName(name); t.setType(type); t.setOrigin(origin); t.setDestination(destination);
        t.setDepartureTime(dep); t.setArrivalTime(arr); t.setDuration(duration); t.setTotalDistanceKm(distance);
        t.setPantryAvailable(pantry); t.setCleanlinessRating(rating); t.setRunsOnDays(days);
        t = trainRepository.save(t);
        for (TrainClassAvailability c : classes) { c.setTrain(t); trainClassRepository.save(c); }
        for (TrainStop s : stops) { s.setTrain(t); trainStopRepository.save(s); }
    }

    private TrainClassAvailability cls(String code, String name, int seats, int price, String coach) {
        TrainClassAvailability c = new TrainClassAvailability();
        c.setClassCode(code); c.setClassName(name); c.setStatus(AvailabilityStatus.AVAILABLE);
        c.setSeatsAvailable(seats); c.setBasePrice(BigDecimal.valueOf(price)); c.setCoachCode(coach);
        return c;
    }

    private TrainStop stop(Station station, String arrival, String departure, int halt, int distance, int day, int platform) {
        TrainStop s = new TrainStop();
        s.setStation(station); s.setArrivalTime(arrival); s.setDepartureTime(departure);
        s.setHaltMinutes(halt); s.setDistanceKm(distance); s.setDay(day); s.setPlatform(platform);
        return s;
    }
}

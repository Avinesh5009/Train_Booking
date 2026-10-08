# RailTicket Backend — Spring Boot + Maven + PostgreSQL

This backend is designed for the uploaded RailTicket React/Vite application. It replaces the frontend's mock/localStorage data with a PostgreSQL-backed REST API.

## Stack

- Java 21
- Spring Boot 3.5.5
- Maven
- Spring Web
- Spring Data JPA / Hibernate
- PostgreSQL
- Bean Validation
- Actuator
- Lombok

## 1. Start PostgreSQL

### Option A — Docker

From this folder:

```bash
docker compose up -d
```

This creates:

- database: `railticket`
- username: `postgres`
- password: `postgres`
- port: `5432`

### Option B — Existing PostgreSQL

Create the database:

```sql
CREATE DATABASE railticket;
```

Then set:

```text
DB_URL=jdbc:postgresql://localhost:5432/railticket
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

The application creates/updates tables automatically using JPA `ddl-auto=update`.

## 2. Run the backend

Requirements:

- JDK 21
- Maven 3.9+

```bash
mvn clean spring-boot:run
```

Or:

```bash
mvn clean package
java -jar target/rail-ticket-backend-1.0.0.jar
```

Backend:

```text
http://localhost:8080
```

Health:

```text
http://localhost:8080/api/health
```

## 3. Seed data

On the first run, sample railway data is inserted automatically:

- Stations
- Hyderabad ↔ Chennai trains
- Delhi ↔ Varanasi
- Delhi ↔ Mumbai
- Pune ↔ Mumbai
- Delhi ↔ Bengaluru
- Train classes
- Train schedules/stops

If the `stations` table already contains data, the seeder does not duplicate the sample data.

## 4. REST API

### Stations

```http
GET /api/stations
GET /api/stations?q=Chennai
```

### Search trains

```http
GET /api/trains/search?from=HYB&to=MAS&date=2026-10-04
```

### Train details

```http
GET /api/trains/{trainId}
GET /api/trains/{trainId}/classes
GET /api/trains/{trainId}/schedule
GET /api/trains/{trainId}/live
```

### Seat availability

```http
GET /api/trains/{trainId}/classes/3A/seats?date=2026-10-04
```

### Create booking

```http
POST /api/bookings
Content-Type: application/json
```

Example:

```json
{
  "trainNumber": "12760",
  "journeyDate": "2026-10-04",
  "classCode": "3A",
  "quota": "General Quota",
  "contactEmail": "rahul@example.com",
  "contactPhone": "9876543210",
  "paymentMethod": "UPI - Demo",
  "passengers": [
    {
      "fullName": "Rahul Sharma",
      "age": 32,
      "gender": "male",
      "berthPreference": "Lower",
      "foodChoice": "Veg",
      "assignedCoach": "B3",
      "assignedSeat": "18",
      "assignedBerthType": "Lower"
    }
  ]
}
```

If the requested seat is already occupied, the backend automatically assigns the next available seat.

### PNR

```http
GET /api/bookings/pnr/{pnr}
```

### My bookings

```http
GET /api/bookings
```

### Booking by ID

```http
GET /api/bookings/{id}
```

### Cancel booking

```http
POST /api/bookings/{id}/cancel
```

The response includes the original fare, cancellation fee and calculated refund.

## 5. Connect the React frontend

Copy:

```text
frontend-api/railwayApi.ts
```

into the React project's `src/api/` directory.

Create the frontend `.env.local`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

Then replace the functions currently coming from:

```text
src/data/mockRailwayData.ts
```

with calls to `railwayApi`.

For example, replace:

```ts
const availableTrains = getTrainsForRoute(fromCode, toCode);
```

with state:

```ts
const [availableTrains, setAvailableTrains] = useState<Train[]>([]);

useEffect(() => {
  railwayApi.searchTrains(fromCode, toCode, journeyDate)
    .then(setAvailableTrains)
    .catch(console.error);
}, [fromCode, toCode, journeyDate]);
```

For booking:

```ts
await railwayApi.createBooking({
  trainNumber: bookingTrain.number,
  journeyDate,
  classCode: bookingClassCode,
  quota: 'General Quota',
  passengers,
  contactEmail,
  contactPhone,
  paymentMethod,
});
```

For PNR:

```ts
const booking = await railwayApi.bookingByPnr(pnr);
```

For cancellation:

```ts
await railwayApi.cancelBooking(bookingId);
```

## 6. PostgreSQL tables

The application creates these main tables:

```text
stations
trains
train_operating_days
train_class_availability
train_stops
bookings
passengers
seat_reservations
```

Important relationship:

```text
Station
  └── Train origin/destination

Train
  ├── TrainClassAvailability
  ├── TrainStop
  └── Booking
        └── Passenger
              └── SeatReservation
```

## Important production note

This is a complete student/demo backend with real PostgreSQL persistence and transactional seat reservations. Payment is intentionally represented as a demo transaction; a real deployment should integrate a payment gateway and add authentication/authorization before accepting real customer payments or personal data.

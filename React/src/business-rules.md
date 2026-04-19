# Business Rules — Sports Court Booking System

## User Roles

| Role | Description |
|---|---|
| `ADMIN` | Manages courts and all bookings |
| `USER` | Searches courts and manages own bookings |

---

## Authentication

- User must register with name, email and password
- Email must be unique in the system
- Login is done via email + password
- Inactive users (`IsActive = false`) cannot log in
- Passwords must be stored as hash (never plain text)

---

## Courts

### ADMIN only
- Create, edit and deactivate courts
- Configure per court:
  - Name
  - Type (`SOCCER`, `TENNIS`, `BASKETBALL`, `VOLLEYBALL`)
  - Region (e.g. Centro, Norte, Sul, Leste, Oeste)
  - Capacity (max number of people)
  - Opening and closing time
  - Slot duration (in minutes, e.g. 60)
  - Cancellation deadline (hours before booking)
  - Active / Inactive status

### Rules
- Inactive courts are not visible to regular users
- Closing time must be after opening time
- Slot duration must be greater than 0
- Capacity must be greater than 0

---

## Bookings

### USER
- Can only create bookings for active courts
- Can only view and manage their own bookings
- Can cancel a booking only if the cancellation deadline has not passed
  - Example: if `CancellationDeadlineHours = 1`, cancellation must happen at least 1 hour before `StartTime`
- Number of people in the booking cannot exceed court capacity
- Can edit a booking (differential feature)

### ADMIN
- Can view all bookings from all courts
- Can cancel any booking regardless of deadline
- Can filter bookings by court, date and status

### Rules
- No two `ACTIVE` bookings can overlap on the same court and date
  - Conflict check: `StartTime < existing.EndTime AND EndTime > existing.StartTime`
- `EndTime` must be greater than `StartTime`
- `NumberOfPeople` must be greater than 0
- Booking can only be made for an active court
- Past bookings cannot be edited or cancelled

---

## Schedule / Agenda

- Slots are generated based on `OpeningTime`, `ClosingTime` and `SlotDuration`
  - Example: opening `08:00`, closing `22:00`, slot `60min` → 14 slots per day
- Each slot displays one of two states:
  - `AVAILABLE` — no active booking in that period
  - `OCCUPIED` — there is an active booking in that period
- Agenda can be navigated by date (previous / next day)
- Agenda can be filtered by court and date

---

## Search & Filters

### USER
- Search courts by region
- Filter courts by type
- Only active courts are shown

### ADMIN
- Filter bookings by court
- Filter bookings by date
- Filter bookings by status (`ACTIVE` / `CANCELLED`)

---

## Status Flow

### Booking
```
ACTIVE ──── cancelled by user (within deadline) ──▶ CANCELLED
ACTIVE ──── cancelled by admin (any time)        ──▶ CANCELLED
```

### Court
```
IsActive: true  ──── deactivated by admin ──▶ IsActive: false
IsActive: false ──── reactivated by admin ──▶ IsActive: true
```

---

## Permissions Summary

| Action | USER | ADMIN |
|---|---|---|
| Register / Login | ✅ | ✅ |
| View active courts | ✅ | ✅ |
| Search courts by region | ✅ | ✅ |
| Filter courts by type | ✅ | ✅ |
| Create booking | ✅ | ✅ |
| View own bookings | ✅ | ✅ |
| Cancel own booking | ✅ (deadline) | ✅ |
| Edit own booking | ✅ (differential) | ✅ |
| View all bookings | ❌ | ✅ |
| Cancel any booking | ❌ | ✅ |
| Create / edit courts | ❌ | ✅ |
| Deactivate courts | ❌ | ✅ |
| Manage users | ❌ | ✅ |

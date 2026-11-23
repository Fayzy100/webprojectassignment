// Bookings API
//
//   GET    /api/bookings       -> return the full list of bookings
//   POST   /api/bookings       -> create a new booking, save it to bookings.json
//   DELETE /api/bookings/:id   -> remove a booking by id

const express = require("express");
const router = express.Router();
const { readData, writeData } = require("../utils/jsonStore");

const REQUIRED_FIELDS = ["roomId", "clubName", "date", "startTime", "endTime"];

// GET /api/bookings
router.get("/", (req, res) => {
  const bookings = readData("bookings.json");
  res.json(bookings);
});

// POST /api/bookings
router.post("/", (req, res) => {
  const body = req.body || {};

  const missing = REQUIRED_FIELDS.filter(
    (field) => !body[field] || String(body[field]).trim() === ""
  );
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(", ")}` });
  }

  const rooms = readData("rooms.json");
  if (!rooms.some((room) => room.id === body.roomId)) {
    return res.status(400).json({ error: "Unknown roomId" });
  }

  if (body.endTime <= body.startTime) {
    return res.status(400).json({ error: "End time must be after start time" });
  }

  const bookings = readData("bookings.json");

  // Prevent double-booking the same room at overlapping times
  const conflict = bookings.some(
    (b) =>
      b.roomId === body.roomId &&
      b.date === body.date &&
      body.startTime < b.endTime &&
      body.endTime > b.startTime
  );
  if (conflict) {
    return res
      .status(409)
      .json({ error: "That room is already booked for an overlapping time" });
  }

  const newBooking = {
    id: Date.now().toString(),
    roomId: body.roomId,
    clubName: body.clubName.trim(),
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    purpose: (body.purpose || "").trim(),
  };

  bookings.push(newBooking);
  writeData("bookings.json", bookings);

  res.status(201).json(newBooking);
});

// DELETE /api/bookings/:id
router.delete("/:id", (req, res) => {
  const bookings = readData("bookings.json");
  const remaining = bookings.filter((b) => b.id !== req.params.id);

  if (remaining.length === bookings.length) {
    return res.status(404).json({ error: "Booking not found" });
  }

  writeData("bookings.json", remaining);
  res.status(200).json({ message: "Booking canceled" });
});

module.exports = router;

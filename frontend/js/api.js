// api.js
//
// This file is the ONLY place that talks to the backend.
// rooms.js / booking.js / my-bookings.js call the functions below and
// never use fetch() directly. Requests go to the Express server
// (npm start, http://localhost:3000) which serves this frontend too,
// so relative URLs like "/api/rooms" work without any CORS setup.

// Parse a response, throwing an Error with the server's message on failure.
async function handleResponse(response) {
  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // response had no JSON body
  }
  if (!response.ok) {
    const message = (data && data.error) || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

// ---------- Rooms ----------

async function getRooms() {
  const response = await fetch("/api/rooms");
  return handleResponse(response);
}

async function getRoomById(id) {
  const response = await fetch(`/api/rooms/${encodeURIComponent(id)}`);
  return handleResponse(response);
}

// ---------- Bookings ----------

async function getBookings() {
  const response = await fetch("/api/bookings");
  return handleResponse(response);
}

async function createBooking(bookingData) {
  // bookingData: { roomId, clubName, date, startTime, endTime, purpose }
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
}

async function deleteBooking(id) {
  const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

// booking.js
//
// Handles the "Book a Room" form on booking.html.

async function populateRoomSelect() {
  const select = document.getElementById("room-select");

  try {
    const rooms = await getRooms();
    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.id;
      option.textContent = `${room.name} (capacity ${room.capacity})`;
      select.appendChild(option);
    });
  } catch (err) {
    showStatus(`Could not load rooms: ${err.message}`, "error");
  }
}

function showStatus(message, type) {
  const statusEl = document.getElementById("form-status");
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  if (type) statusEl.classList.add(type);
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const bookingData = {
    roomId: document.getElementById("room-select").value,
    clubName: document.getElementById("club-name").value,
    date: document.getElementById("date").value,
    startTime: document.getElementById("start-time").value,
    endTime: document.getElementById("end-time").value,
    purpose: document.getElementById("purpose").value,
  };

  // Simple client-side validation
  if (bookingData.endTime <= bookingData.startTime) {
    showStatus("End time must be after start time.", "error");
    return;
  }

  try {
    await createBooking(bookingData);
    showStatus("Booking created! See it under My Bookings.", "success");
    event.target.reset();
  } catch (err) {
    showStatus(err.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  populateRoomSelect();
  document
    .getElementById("booking-form")
    .addEventListener("submit", handleBookingSubmit);
});

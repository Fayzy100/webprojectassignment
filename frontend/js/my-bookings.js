// my-bookings.js
//
// Renders the list of bookings on my-bookings.html and lets the
// user cancel a booking.

// Escape text before putting it into innerHTML (club names/purposes are user input).
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

async function renderBookings() {
  const container = document.getElementById("bookings-list");

  try {
    const [bookings, rooms] = await Promise.all([getBookings(), getRooms()]);

    if (!bookings || bookings.length === 0) {
      container.innerHTML =
        '<p>No bookings yet. <a href="booking.html">Book a room</a> to get started.</p>';
      return;
    }

    const roomNames = {};
    rooms.forEach((room) => {
      roomNames[room.id] = room.name;
    });

    container.innerHTML = bookings
      .map(
        (b) => `
        <div class="booking-item">
          <h3>${escapeHtml(roomNames[b.roomId] || b.roomId)}</h3>
          <p><strong>Club:</strong> ${escapeHtml(b.clubName)}</p>
          <p><strong>Date:</strong> ${escapeHtml(b.date)}</p>
          <p><strong>Time:</strong> ${escapeHtml(b.startTime)} - ${escapeHtml(b.endTime)}</p>
          <p><strong>Purpose:</strong> ${escapeHtml(b.purpose) || "—"}</p>
          <button class="cancel-btn" data-id="${escapeHtml(b.id)}">Cancel</button>
        </div>`
      )
      .join("");

    container.querySelectorAll(".cancel-btn").forEach((button) => {
      button.addEventListener("click", () =>
        handleCancelClick(button.dataset.id)
      );
    });
  } catch (err) {
    container.innerHTML = `<p class="status-message error">Could not load bookings: ${escapeHtml(err.message)}</p>`;
  }
}

async function handleCancelClick(bookingId) {
  try {
    await deleteBooking(bookingId);
  } catch (err) {
    alert(`Could not cancel booking: ${err.message}`);
  }
  await renderBookings();
}

document.addEventListener("DOMContentLoaded", renderBookings);

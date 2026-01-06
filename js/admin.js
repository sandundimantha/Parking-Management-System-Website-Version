document.addEventListener('DOMContentLoaded', () => {
    // 1. Calculate Stats
    const slots = JSON.parse(localStorage.getItem('parkPalSlots')) || [];

    const total = slots.length;
    const booked = slots.filter(s => s.booked).length;
    const available = total - booked;

    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-available').textContent = available;
    document.getElementById('stats-booked').textContent = booked;

    // 2. Populate Table
    const bookings = JSON.parse(localStorage.getItem('parkPalBookings')) || [];
    const tbody = document.getElementById('bookings-table');

    if (bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No recent bookings found.</td></tr>';
    } else {
        bookings.forEach(b => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${b.name}</td>
                <td>${b.vehicle}</td>
                <td><strong>${b.slot}</strong></td>
                <td>${b.date}</td>
                <td><span style="color: var(--secondary-color); font-weight: 600;">Confirmed</span></td>
            `;
            tbody.appendChild(row);
        });
    }
});

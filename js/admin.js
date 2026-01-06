document.addEventListener('DOMContentLoaded', () => {
    // 1. Calculate Stats
    const slots = JSON.parse(localStorage.getItem('parkPalSlots')) || [];

    // Calculate total stats
    const total = slots.length;
    const booked = slots.filter(s => s.booked).length;
    const available = total - booked;

    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-available').textContent = available;
    document.getElementById('stats-booked').textContent = booked;

    // 2. Initial Table Load
    const bookings = JSON.parse(localStorage.getItem('parkPalBookings')) || [];
    renderTable(bookings);

    // Make function global for onclick handlers
    window.filterBookings = function (duration) {
        // Update active button style (simple version)
        const buttons = document.querySelectorAll('#filters button');
        buttons.forEach(btn => {
            if (btn.textContent === duration) {
                btn.classList.add('btn-primary');
                btn.style.background = 'var(--primary-color)';
                btn.style.color = 'white';
            } else {
                btn.classList.remove('btn-primary');
                btn.style.background = 'transparent';
                btn.style.color = 'var(--text-color)';
            }
        });

        if (duration === 'All') {
            renderTable(bookings);
        } else {
            const filtered = bookings.filter(b => b.duration === duration);
            renderTable(filtered);
        }
    };

    function renderTable(data) {
        const tbody = document.getElementById('bookings-table');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No recent bookings found for this category.</td></tr>';
        } else {
            data.forEach(b => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${b.name}</td>
                    <td>${b.vehicle}</td>
                    <td><strong>${b.slot}</strong></td>
                    <td>${b.duration || 'Daily'}</td>
                    <td>${b.date}</td>
                    <td><span style="color: var(--secondary-color); font-weight: 600;">Confirmed</span></td>
                `;
                tbody.appendChild(row);
            });
        }
    }
});

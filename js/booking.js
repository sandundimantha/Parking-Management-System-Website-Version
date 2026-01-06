document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slotId = urlParams.get('slot');
    const slotInput = document.getElementById('slot');
    const dateInput = document.getElementById('date');

    if (slotId) {
        slotInput.value = slotId;
    } else {
        alert('No slot selected! Redirecting to Home.');
        window.location.href = 'index.html';
    }

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;

    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const bookingDetails = {
            name: document.getElementById('name').value,
            vehicle: document.getElementById('vehicle').value,
            slot: slotInput.value,
            date: dateInput.value,
            duration: document.getElementById('duration').value
        };

        // Save to sessionStorage to pass to payment page
        sessionStorage.setItem('currentBooking', JSON.stringify(bookingDetails));

        window.location.href = 'payment.html';
    });
});

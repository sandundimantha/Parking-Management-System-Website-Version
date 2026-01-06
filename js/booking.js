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

    // Pricing Logic
    const rates = {
        'Car': { 'Daily': 10, 'Weekly': 60, 'Monthly': 200, 'Yearly': 2000 },
        'Bike': { 'Daily': 5, 'Weekly': 30, 'Monthly': 100, 'Yearly': 1000 },
        'Jeep': { 'Daily': 12, 'Weekly': 70, 'Monthly': 250, 'Yearly': 2500 },
        'Lorry': { 'Daily': 20, 'Weekly': 120, 'Monthly': 400, 'Yearly': 4000 },
        'Car EV': { 'Daily': 15, 'Weekly': 90, 'Monthly': 300, 'Yearly': 3000 },
        'Bike EV': { 'Daily': 8, 'Weekly': 40, 'Monthly': 150, 'Yearly': 1500 },
        'Jeep EV': { 'Daily': 18, 'Weekly': 100, 'Monthly': 350, 'Yearly': 3500 },
        'Lorry EV': { 'Daily': 25, 'Weekly': 150, 'Monthly': 500, 'Yearly': 5000 }
    };

    const durationSelect = document.getElementById('duration');
    const priceSpan = document.getElementById('price-amount');

    function calculatePrice() {
        // Extract type from slot ID (e.g. "Car-1" -> "Car", "Car EV-1" -> "Car EV")
        let type = 'Car';
        if (slotInput.value) {
            // Split by last hyphen to separate ID number
            // "Car-1" -> ["Car", "1"]
            // "Car EV-1" -> ["Car EV", "1"]
            const lastHyphenIndex = slotInput.value.lastIndexOf('-');
            if (lastHyphenIndex !== -1) {
                type = slotInput.value.substring(0, lastHyphenIndex);
            }
        }

        // Handle edge cases where ID format might differ
        if (!rates[type]) type = 'Car';

        const duration = durationSelect.value;
        const price = rates[type][duration];

        priceSpan.textContent = price;
        return price;
    }

    // Calculate initially and on change
    if (slotInput.value) calculatePrice();
    durationSelect.addEventListener('change', calculatePrice);


    const form = document.getElementById('booking-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const bookingDetails = {
            name: document.getElementById('name').value,
            vehicle: document.getElementById('vehicle').value,
            slot: slotInput.value,
            date: dateInput.value,
            duration: document.getElementById('duration').value,
            price: calculatePrice() // Save calculated price
        };

        // Save to sessionStorage to pass to payment page
        sessionStorage.setItem('currentBooking', JSON.stringify(bookingDetails));

        window.location.href = 'payment.html';
    });
});

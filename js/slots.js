document.addEventListener('DOMContentLoaded', () => {
    const parkingLot = document.getElementById('parking-lot');
    
    // Configuration
    const rows = ['A', 'B'];
    const slotsPerRow = 6;
    
    // Generate Slots
    // Ideally this would come from a backend/local storage, 
    // but for this demo we'll randomize availability on load if not set.
    
    // check if we have slot data in localStorage
    let slotData = JSON.parse(localStorage.getItem('parkPalSlots'));
    
    if (!slotData) {
        slotData = [];
        rows.forEach(row => {
            for (let i = 1; i <= slotsPerRow; i++) {
                slotData.push({
                    id: `${row}${i}`,
                    booked: Math.random() < 0.4 // 40% chance of being booked
                });
            }
        });
        localStorage.setItem('parkPalSlots', JSON.stringify(slotData));
    }

    renderSlots(slotData);

    function renderSlots(slots) {
        parkingLot.innerHTML = '';
        slots.forEach(slot => {
            const slotEl = document.createElement('div');
            slotEl.classList.add('slot');
            if (slot.booked) {
                slotEl.classList.add('booked');
                slotEl.title = "Slot Booked";
            } else {
                slotEl.classList.add('available');
                slotEl.title = "Click to Book";
                slotEl.onclick = () => window.location.href = `booking.html?slot=${slot.id}`;
            }

            const carImg = document.createElement('img');
            carImg.src = 'images/car.png';
            carImg.alt = 'Car Icon';

            const slotId = document.createElement('span');
            slotId.classList.add('slot-id');
            slotId.textContent = slot.id;

            slotEl.appendChild(carImg);
            slotEl.appendChild(slotId);
            parkingLot.appendChild(slotEl);
        });
    }
});

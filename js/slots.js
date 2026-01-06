document.addEventListener('DOMContentLoaded', () => {
    const parkingLotContainer = document.getElementById('parking-lot-container');

    // Configuration
    const vehicleTypes = [
        { type: 'Car', count: 30, icon: 'images/bmw_car.png' },
        { type: 'Bike', count: 30, icon: 'images/bike.png' },
        { type: 'Jeep', count: 30, icon: 'images/jeep.png' },
        { type: 'Lorry', count: 30, icon: 'images/lorry.png' }
    ];

    // Check and Reset Data for Version 3 (Expanded Counts)
    let slotData = JSON.parse(localStorage.getItem('parkPalSlots'));

    // Check if we need to expand data
    // We can do a simple check: if we have less slots than expected, we re-verify or append
    // For simplicity in this demo, if the count doesn't match roughly, we reset.
    // Or simpler: check if 'Bike' exists, AND if we have enough of them.

    const totalExpected = 30 * 4;
    const currentCount = slotData ? slotData.length : 0;

    // Force reset if counts don't match our new requirement (or if data is missing)
    if (!slotData || currentCount < totalExpected) {
        slotData = [];
        vehicleTypes.forEach(vt => {
            for (let i = 1; i <= vt.count; i++) {
                slotData.push({
                    id: `${vt.type}-${i}`,
                    type: vt.type,
                    booked: Math.random() < 0.2 // Reduced booking chance since we have so many slots
                });
            }
        });
        localStorage.setItem('parkPalSlots', JSON.stringify(slotData));
    }

    renderAllSlots(slotData);

    function renderAllSlots(slots) {
        parkingLotContainer.innerHTML = ''; // Clear container

        vehicleTypes.forEach(vt => {
            // Create Section for each type
            const section = document.createElement('div');
            section.className = 'mb-4';

            const title = document.createElement('h3');
            title.textContent = `${vt.type} Parking (${vt.count} Slots)`;
            section.appendChild(title);

            const grid = document.createElement('div');
            grid.classList.add('parking-lot');

            // Filter slots for this type
            const typeSlots = slots.filter(s => s.type === vt.type);

            typeSlots.forEach(slot => {
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
                carImg.src = vt.icon; // Use specific icon
                carImg.alt = `${vt.type} Icon`;

                const slotId = document.createElement('span');
                slotId.classList.add('slot-id');
                slotId.textContent = slot.id.split('-')[1]; // Just show number to save space

                slotEl.appendChild(carImg);
                slotEl.appendChild(slotId);
                grid.appendChild(slotEl);
            });

            section.appendChild(grid);
            parkingLotContainer.appendChild(section);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const parkingLotContainer = document.getElementById('parking-lot-container');

    // Configuration
    const vehicleTypes = [
        { type: 'Car', count: 6, icon: 'images/car.png' },
        { type: 'Bike', count: 6, icon: 'images/car.png' }, // Default placeholder, ideally would be unique
        { type: 'Jeep', count: 4, icon: 'images/car.png' },
        { type: 'Lorry', count: 3, icon: 'images/car.png' }
    ];

    // Check and Reset Data for Version 2 (Typed Slots)
    let slotData = JSON.parse(localStorage.getItem('parkPalSlots'));

    // Simple check: if data exists but ID doesn't contain hyphen or known type, reset.
    // Or just force reset if specific flag not present.
    const isV2 = slotData && slotData.length > 0 && (slotData[0].type !== undefined);

    if (!slotData || !isV2) {
        slotData = [];
        vehicleTypes.forEach(vt => {
            for (let i = 1; i <= vt.count; i++) {
                slotData.push({
                    id: `${vt.type}-${i}`,
                    type: vt.type,
                    booked: Math.random() < 0.3 // 30% chance booked
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
            title.textContent = `${vt.type} Parking`;
            // title.style.borderBottom = `2px solid var(--primary-color)`;
            // title.style.display = 'inline-block';
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
                carImg.src = vt.icon; // Use icon from config
                carImg.alt = 'Vehicle Icon';

                const slotId = document.createElement('span');
                slotId.classList.add('slot-id');
                slotId.textContent = slot.id;

                slotEl.appendChild(carImg);
                slotEl.appendChild(slotId);
                grid.appendChild(slotEl);
            });

            section.appendChild(grid);
            parkingLotContainer.appendChild(section);
        });
    }
});

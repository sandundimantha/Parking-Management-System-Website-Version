document.addEventListener('DOMContentLoaded', () => {
    const parkingLotContainer = document.getElementById('parking-lot-container');
    const toggle = document.getElementById('availability-toggle');

    // Configuration
    const vehicleTypes = [
        { type: 'Car', count: 30, icon: 'images/bmw_car.png' },
        { type: 'Bike', count: 30, icon: 'images/bike.png' },
        { type: 'Jeep', count: 30, icon: 'images/jeep.png' },
        { type: 'Lorry', count: 30, icon: 'images/lorry.png' }
    ];

    // Data Management
    let slotData = JSON.parse(localStorage.getItem('parkPalSlots'));
    const totalExpected = 30 * 4;

    if (!slotData || slotData.length < totalExpected) {
        slotData = [];
        vehicleTypes.forEach(vt => {
            for (let i = 1; i <= vt.count; i++) {
                slotData.push({
                    id: `${vt.type}-${i}`,
                    type: vt.type,
                    booked: Math.random() < 0.2
                });
            }
        });
        localStorage.setItem('parkPalSlots', JSON.stringify(slotData));
    }

    // Initial Render
    renderAllSlots(slotData, false);

    // Toggle Listener
    if (toggle) {
        toggle.addEventListener('change', (e) => {
            renderAllSlots(slotData, e.target.checked);
        });
    }

    function renderAllSlots(slots, showAvailableOnly) {
        parkingLotContainer.innerHTML = '';

        vehicleTypes.forEach(vt => {
            const typeSlots = slots.filter(s => s.type === vt.type);
            const availableCount = typeSlots.filter(s => !s.booked).length;

            // Allow section to hide if filtering only available and none are available? 
            // Better to show empty state.

            // Header with Stats
            const section = document.createElement('div');
            section.className = `mb-4 section-${vt.type.toLowerCase()}`;
            section.style.padding = '1.5rem';
            section.style.borderRadius = '1rem';

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '1rem';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            header.style.paddingBottom = '0.5rem';

            const title = document.createElement('h3');
            title.style.marginBottom = '0';
            title.textContent = `${vt.type} Parking`;
            // Add background box to title
            title.style.background = 'white';
            title.style.padding = '0.5rem 1rem';
            title.style.borderRadius = '0.5rem';
            title.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            title.style.display = 'inline-block';

            const badge = document.createElement('span');
            badge.style.background = availableCount > 0 ? 'var(--secondary-color)' : 'var(--danger-color)';
            badge.style.color = 'white';
            badge.style.padding = '0.25rem 0.75rem';
            badge.style.borderRadius = '20px';
            badge.style.fontSize = '0.875rem';
            badge.style.fontWeight = '600';
            badge.textContent = `${availableCount} Available`;

            header.appendChild(title);
            header.appendChild(badge);
            section.appendChild(header);

            // Grid
            const grid = document.createElement('div');
            grid.classList.add('parking-lot');

            let visibleSlots = typeSlots;
            if (showAvailableOnly) {
                visibleSlots = typeSlots.filter(s => !s.booked);
            }

            if (visibleSlots.length === 0) {
                grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--text-light);">No slots available matching your criteria.</p>';
            } else {
                visibleSlots.forEach(slot => {
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
                    carImg.src = vt.icon;
                    carImg.alt = `${vt.type} Icon`;

                    const slotId = document.createElement('span');
                    slotId.classList.add('slot-id');
                    slotId.textContent = slot.id.split('-')[1];

                    slotEl.appendChild(carImg);
                    slotEl.appendChild(slotId);
                    grid.appendChild(slotEl);
                });
            }

            section.appendChild(grid);
            parkingLotContainer.appendChild(section);
        });
    }
});

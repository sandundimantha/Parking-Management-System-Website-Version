document.addEventListener('DOMContentLoaded', () => {
    // Security Check
    if (typeof Auth !== 'undefined') {
        Auth.requireAdmin();
    } else {
        // Fallback if auth.js didn't load for some reason, though it should.
        window.location.href = 'login.html';
    }

    // 1. Calculate Stats
    const slots = JSON.parse(localStorage.getItem('parkPalSlots')) || [];

    // Calculate total stats
    const total = slots.length;
    const booked = slots.filter(s => s.booked).length;
    const available = total - booked;

    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-available').textContent = available;
    document.getElementById('stats-booked').textContent = booked;

    // 1b. Calculate Vehicle Specific Stats for Chart
    const vehicleCounts = {
        'Car': 0, 'Bike': 0, 'Jeep': 0, 'Lorry': 0,
        'Car EV': 0, 'Bike EV': 0, 'Jeep EV': 0, 'Lorry EV': 0
    };

    slots.forEach(s => {
        if (s.booked) {
            // Extract type from ID (e.g. "Car-1", "Car EV-1")
            let type = s.id.split('-')[0];
            // Handle space in EV types if format is "Car EV-1" (split gives "Car EV") -- actually split('-')[0] works if delimiter is strictly first hyphen
            // But wait, split('-')[0] of "Car EV-1" IS "Car EV". Correct.
            // Just need to ensure the key exists.

            // Re-verify split logic: "Car EV-1".split('-') -> ["Car EV", "1"] -> [0] is "Car EV".
            // So it matches the key. 

            if (vehicleCounts[type] !== undefined) {
                vehicleCounts[type]++;
            }
        }
    });

    // Render Chart
    const ctx = document.getElementById('vehicleChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Car', 'Bike', 'Jeep', 'Lorry', 'Car EV', 'Bike EV', 'Jeep EV', 'Lorry EV'],
            datasets: [{
                data: [
                    vehicleCounts['Car'], vehicleCounts['Bike'], vehicleCounts['Jeep'], vehicleCounts['Lorry'],
                    vehicleCounts['Car EV'], vehicleCounts['Bike EV'], vehicleCounts['Jeep EV'], vehicleCounts['Lorry EV']
                ],
                backgroundColor: [
                    '#3b82f6', // Car (Blue)
                    '#22c55e', // Bike (Green)
                    '#f59e0b', // Jeep (Yellow)
                    '#ef4444', // Lorry (Red)
                    '#60a5fa', // Car EV (Light Blue)
                    '#4ade80', // Bike EV (Light Green)
                    '#fcd34d', // Jeep EV (Light Yellow)
                    '#f87171'  // Lorry EV (Light Red)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

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

    // 3. User Management Logic
    const users = JSON.parse(localStorage.getItem('parkPalUsers')) || [];
    renderUsers(users);

    function renderUsers(usersData) {
        const tbody = document.getElementById('users-table');
        if (!tbody) return; // Guard clause

        tbody.innerHTML = '';

        if (usersData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No registered users found.</td></tr>';
        } else {
            usersData.forEach(user => {
                // Don't show admin in the normal user list or handle differently
                if (user.role === 'admin') return;

                const isActive = user.isActive !== false; // Default true
                const statusColor = isActive ? 'var(--secondary-color)' : 'var(--danger-color)';
                const statusText = isActive ? 'Active' : 'Deactivated';
                const btnText = isActive ? 'Deactivate' : 'Activate';
                const btnColor = isActive ? 'var(--danger-color)' : 'var(--secondary-color)';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><span style="color: ${statusColor}; font-weight: 600;">${statusText}</span></td>
                    <td>
                        <button onclick="viewUserProfile('${user.email}')" 
                                style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; margin-right: 0.5rem;">
                            View
                        </button>
                        <button onclick="toggleUserStatus('${user.email}')" 
                                style="background: ${btnColor}; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">
                            ${btnText}
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    // Toggle User Status
    window.toggleUserStatus = function (email) {
        const currentUsers = JSON.parse(localStorage.getItem('parkPalUsers')) || [];
        const userIndex = currentUsers.findIndex(u => u.email === email);

        if (userIndex !== -1) {
            // Toggle status (initialize to true if undefined)
            if (currentUsers[userIndex].isActive === undefined) {
                currentUsers[userIndex].isActive = true;
            }
            currentUsers[userIndex].isActive = !currentUsers[userIndex].isActive;

            // Save and Re-render
            localStorage.setItem('parkPalUsers', JSON.stringify(currentUsers));
            renderUsers(currentUsers);
            alert(`User ${currentUsers[userIndex].isActive ? 'Activated' : 'Deactivated'} successfully.`);
        }
    };

    // View User Profile
    window.viewUserProfile = function (email) {
        const currentUsers = JSON.parse(localStorage.getItem('parkPalUsers')) || [];
        const user = currentUsers.find(u => u.email === email);

        if (user) {
            const bookings = JSON.parse(localStorage.getItem('parkPalBookings')) || [];
            // Filter by name since we don't strictly link by ID yet
            const userBookings = bookings.filter(b => b.name.toLowerCase() === user.name.toLowerCase());

            // 1. Populate Details
            const detailsDiv = document.getElementById('user-profile-details');
            detailsDiv.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Status:</strong> ${user.isActive !== false ? 'Active' : 'Deactivated'}</p>
            `;

            // 2. Populate Bookings
            const bookingsTbody = document.getElementById('user-profile-bookings');
            bookingsTbody.innerHTML = '';
            if (userBookings.length === 0) {
                bookingsTbody.innerHTML = '<tr><td colspan="5" class="text-center">No bookings found for this user.</td></tr>';
            } else {
                userBookings.forEach(b => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${b.slot}</strong></td>
                        <td>${b.vehicle}</td>
                        <td>${b.duration || 'Daily'}</td>
                        <td>${b.date}</td>
                        <td><span style="color: var(--secondary-color);">Active</span></td>
                    `;
                    bookingsTbody.appendChild(row);
                });
            }

            // 3. Show Modal
            document.getElementById('userProfileModal').style.display = 'block';
        }
    };

    window.closeUserProfile = function () {
        document.getElementById('userProfileModal').style.display = 'none';
    };

    // Close modal if clicking outside
    window.onclick = function (event) {
        const modal = document.getElementById('userProfileModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});

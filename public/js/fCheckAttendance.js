// Get selected session from URL
const urlParams = new URLSearchParams(window.location.search);
const selectedSession = urlParams.get('sesh') || 'all';

// Set active session button
const sessionButtons = document.querySelectorAll('.session-btn');
sessionButtons.forEach(btn => {
    if (btn.dataset.session === selectedSession) {
        btn.classList.add('active');
    }
});

// Search functionality for attendance
const searchInput = document.getElementById('searchInput');
const attendanceTable = document.getElementById('attendanceTable');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = attendanceTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
        // Skip the "no students" message row
        if (row.cells.length === 1) {
            return;
        }

        const name = row.dataset.name.toLowerCase();
        const isVisible = name.includes(searchTerm);
        row.style.display = isVisible ? '' : 'none';
    });
});

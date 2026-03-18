// Get selected session and date from URL
const urlParams = new URLSearchParams(window.location.search);
const selectedSession = urlParams.get('sesh') || 'all';
const selectedDate = urlParams.get('date') || new Date().toISOString().split('T')[0];

// Set active session button
const sessionButtons = document.querySelectorAll('.session-btn');
sessionButtons.forEach(btn => {
    if (btn.dataset.session === selectedSession) {
        btn.classList.add('active');
    }
});

// Date input handler
const dateInput = document.getElementById('dateInput');
dateInput.addEventListener('change', (e) => {
    const newDate = e.target.value;
    window.location.href = `/checkSignout?date=${newDate}&sesh=${selectedSession}`;
});

// Search functionality
const nameSearch = document.getElementById('nameSearch');
const checkoutTable = document.getElementById('checkoutTable');

nameSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = checkoutTable.querySelectorAll('tbody tr');

    rows.forEach(row => {
        // Skip the "no records" message row
        if (row.cells.length === 1) {
            return;
        }

        const name = row.dataset.name.toLowerCase();
        const isVisible = name.includes(searchTerm);
        row.style.display = isVisible ? '' : 'none';
    });
});

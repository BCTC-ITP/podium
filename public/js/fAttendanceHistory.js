document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameSearch');
    const dateInput = document.getElementById('dateSearch');
    const currentDateSpan = document.getElementById('currentDate');
    const table = document.getElementById('attendanceTable');
    const tbody = table.querySelector('tbody');

    // Filter table by name
    function filterTable() {
        const filter = nameInput.value.toLowerCase();
        const rows = tbody.getElementsByTagName('tr');

        for (let row of rows) {
            const fname = row.cells[0].textContent.toLowerCase();
            const lname = row.cells[1].textContent.toLowerCase();
            row.style.display = (fname.includes(filter) || lname.includes(filter)) ? '' : 'none';
        }
    }

    // Handle name search
    nameInput.addEventListener('keyup', filterTable);

    // Handle date change
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            window.location.href = `?date=${selectedDate}`;
        }
    });
});

// Filter functionality
let currentFilter = 'all';
let currentSearch = '';

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    applyFilter();
});

const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // Apply filter
        currentFilter = e.target.dataset.filter;
        applyFilter();
    });
});

function applyFilter() {
    const studentItems = document.querySelectorAll('.students-item');
    let visibleCount = 0;

    studentItems.forEach(item => {
        const session = item.dataset.session;
        const firstName = item.dataset.firstName.toLowerCase();
        const lastName = item.dataset.lastName.toLowerCase();
        const studentId = item.dataset.id.toLowerCase();

        // Apply session filter
        let matchesSession = false;
        if (currentFilter === 'all') {
            matchesSession = true;
        } else if (currentFilter === session) {
            matchesSession = true;
        }

        // Apply search filter
        let matchesSearch = false;
        if (currentSearch === '') {
            matchesSearch = true;
        } else if (
            firstName.includes(currentSearch) ||
            lastName.includes(currentSearch) ||
            studentId.includes(currentSearch) ||
            `${firstName} ${lastName}`.includes(currentSearch)
        ) {
            matchesSearch = true;
        }

        // Show if both filters match
        if (matchesSession && matchesSearch) {
            item.style.display = '';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Handle no results message
    const noStudentsMsg = document.getElementById('no-students-msg');
    if (visibleCount === 0 && noStudentsMsg) {
        noStudentsMsg.style.display = '';
    } else if (noStudentsMsg) {
        noStudentsMsg.style.display = 'none';
    }
}

// Add student button
const addstudentsButton = document.getElementById('btnAddStudent');
addstudentsButton.addEventListener('click', () => {
    const html = `
        <div class="add-student-form">
            <p class="close-modal">X</p>
            <h2>Add New student</h2>
            <label for="studentId">ID:</label>
            <input type="text" id="studentId" name="studentId" required>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required>
            <label for="session">Session:</label>
            <select id="session" name="session" required>
                <option value="">Select Session</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
            <button id="submitAddStudent" type="button">Add student</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = html;
    document.body.appendChild(modal);

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });


    document.getElementById('submitAddStudent').addEventListener('click', async () => {
        const id = document.getElementById('studentId').value.trim();
        const fname = document.getElementById('firstName').value.trim();
        const lname = document.getElementById('lastName').value.trim();
        const session = document.getElementById('session').value.trim();
        if(!fname || !lname || !session || !id) {
            alert('Please fill in all fields.');
            return;
        }

        if(id.length > 9) {
            alert('Student ID must not exceed 9 digits.');
            return;
        }

        try {
            const response = await fetch('/managestudents/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id:id, fname: fname, lname: lname, session: session })
            });

            const result = await response.json();
            if (result.success) {
                alert('student added successfully.');
                document.body.removeChild(modal);
                location.reload();
            } else {
                alert('Error adding student: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Error adding student.');
        }
    });

    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            document.body.removeChild(modal);
        }
    });
});

document.getElementById('students-list').addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btnEditStudent');
    if (editBtn) {
        const studentItem = editBtn.closest('.students-item');
        const studentId = studentItem.dataset.id;
        const fname = studentItem.dataset.firstName;
        const lname = studentItem.dataset.lastName;
        const session = studentItem.dataset.session;

        const html = `
            <div class="add-student-form">
            <p class="close-modal">X</p>
            <h2>Edit student</h2>
            <label for="studentId">ID:</label>
            <input type="text" id="studentId" name="studentId" readonly>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required>
            <label for="session">Session:</label>
            <select id="session" name="session" required>
                <option value="">Select Session</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
            <button id="submitEditStudent" type="button">Edit student</button>
        </div>
        `;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = html;
        document.body.appendChild(modal);

        document.getElementById('studentId').value = studentId;
        document.getElementById('firstName').value = fname;
        document.getElementById('lastName').value = lname;
        document.getElementById('session').value = session;

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('submitEditStudent').addEventListener('click', async () => {
        const id = document.getElementById('studentId').value.trim();
        const fname = document.getElementById('firstName').value.trim();
        const lname = document.getElementById('lastName').value.trim();
        const session = document.getElementById('session').value.trim();

           if(!fname || !lname || !session || !id) {
                alert('Please fill in all fields.');
                return;
            }

            if(id.length > 9) {
                alert('Student ID must not exceed 9 digits.');
                return;
            }

            try {
                const response = await fetch('/managestudents/edit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({  id:id, fname: fname, lname: lname, session: session })
                });

                const result = await response.json();
                if (result.success) {
                    alert('student edited successfully.');
                    document.body.removeChild(modal);
                    location.reload();
                } else {
                    alert('Error editing student: ' + result.message);
                }
            } catch (error) {
                console.error('Error editing student:', error);
                alert('Error editing student.');
            }
        });

        modal.addEventListener('click', (ev) => {
            if (ev.target === modal) document.body.removeChild(modal);
        });
    }

    const deleteBtn = e.target.closest('.btnDeleteStudent');
    if (deleteBtn) {
        const studentItem = deleteBtn.closest('.students-item');
        const studentId = studentItem.dataset.id;
        const fname = studentItem.dataset.firstName;

        if (!confirm(`Are you sure you want to delete ${fname}?`)) return;

        fetch('/managestudents/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId })
        })
        .then(r => r.json())
        .then(result => {
            if (result.success) {
                location.reload();
            } else {
                alert('Error deleting student: ' + result.message);
            }
        })
        .catch(err => {
            console.error('Error deleting student:', err);
            alert('Error deleting student.');
        });
    }
});


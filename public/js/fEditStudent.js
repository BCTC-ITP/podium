const addstudentsButton = document.getElementById('btnAddstudent');
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
            <input type="text" id="session" name="session" required>
            <button id="submitAddstudent" type="button">Add student</button>
        </div>
    `;

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = html;
    document.body.appendChild(modal);

    document.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });


    document.getElementById('submitAddstudent').addEventListener('click', async () => {
        const id = docukment.getElementById('studentId').value.trim();
        const fname = document.getElementById('firstName').value.trim();
        const lname = document.getElementById('lastName').value.trim();
        const session = document.getElementById('session').value.trim();
        if(!fname || !lname || !session || !id) {
            alert('Please fill in all fields.');
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
    const editBtn = e.target.closest('.btnEditstudent');
    if (editBtn) {
        const studentItem = editBtn.closest('.student-item');
        const studentId = studentItem.dataset.id;
        const fname = studentItem.dataset.fname;
        const lname = studentItem.dataset.lname;
        const session = studentItem.dataset.sess;

        const html = `
            <div class="add-student-form">
            <p class="close-modal">X</p>
            <h2>Edit student</h2>
            <label for="studentId">ID:</label>
            <input type="text" id="studentId" name="studentId" required>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required>
            <label for="session">Session:</label>
            <input type="text" id="session" name="session" required>
            <button id="submitEditStudent" type="button">Add student</button>
        </div>
        `;

        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = html;
        document.body.appendChild(modal);

        document.getElementById('studentId').value = id;
        document.getElementById('firstName').value = fname;
        document.getElementById('lastName').value = lname;
        document.getElementById('sessoin').value = session;

        document.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        document.getElementById('submitEditStudent').addEventListener('click', async () => {
        const id = docukment.getElementById('studentId').value.trim();
        const fname = document.getElementById('firstName').value.trim();
        const lname = document.getElementById('lastName').value
        const session = document.getElementById('session').value

           if(!fname || !lname || !session || !id) {
                alert('Please fill in all fields.');
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

    const deleteBtn = e.target.closest('.btnDeletestudent');
    if (deleteBtn) {
        const studentItem = deleteBtn.closest('.student-item');
        const studentId = studentItem.dataset.id;
        const fname = studentItem.dataset.fname;

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


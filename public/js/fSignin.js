const scanBtn = document.getElementById("scan-btn");
const typeBtn = document.getElementById("type-btn");
const idInput = document.getElementById("id-input");

let scanned = false;
let storedTypedID = "";
let scanTimer = null;
let lastKeyTime = 0;
let scanInput = "";
const scanDelay = 150; // Delay after last char to consider scan complete
const maxKeyInterval = 100; // Max time between keystrokes to still count as "scanned"

scanBtn.addEventListener("click", () => {
    storedTypedID = idInput.value;
    idInput.value = "";
    idInput.placeholder = "Scan your ID";
    idInput.type = "text";
    idInput.disabled = false;
    idInput.focus();
    scanned = true;
    scanInput = "";
    lastKeyTime = 0;
    scanBtn.disabled = true;
    typeBtn.disabled = false;
});

typeBtn.addEventListener("click", () => {
    idInput.value = storedTypedID;
    idInput.placeholder = "Enter your 9-digit ID";
    idInput.type = "number";
    idInput.disabled = false;
    idInput.focus();
    scanned = false;
    typeBtn.disabled = true;
    scanBtn.disabled = false;
});

// Input handler
idInput.addEventListener("keydown", (e) => {
    if (!scanned) return; // Not in scan mode

    const currentTime = Date.now();

    if (lastKeyTime && currentTime - lastKeyTime > maxKeyInterval) {
        // Too slow between keystrokes → likely manual typing
        scanInput = ""; // Reset
        console.warn("Typing too slow. Ignoring as scan.");
    }

    lastKeyTime = currentTime;

    // Only allow digits
    if (!/\d/.test(e.key)) {
        e.preventDefault();
        return;
    }

    scanInput += e.key;

    // Limit to 9 digits
    if (scanInput.length > 9) {
        scanInput = scanInput.slice(0, 9);
    }

    // Reset timer for when scan completes
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => {
        if (scanInput.length === 9) {
            alert(`Your ID is: ${scanInput}`);
            updateAttendance(scanInput, scanned);
            scanInput = "";
            idInput.value = ""; // Clear the input
        } else {
            console.warn("Incomplete scan ignored.");
            scanInput = "";
            idInput.value = "";
        }
    }, scanDelay);

    // Prevent actual text from showing in input box
    e.preventDefault();
});

idInput.addEventListener("input", () => {
    if (!scanned) {
        // Type mode
        idInput.value = idInput.value.replace(/\D/g, "");

        if (idInput.value.length > 9) {
            idInput.value = idInput.value.slice(0, 9);
        }

        if (idInput.value.length === 9) {
            alert(`Your ID is: ${idInput.value}`);
            updateAttendance(idInput.value, scanned);
        }
    } else {
        // Scan mode — clear any text that accidentally got in
        idInput.value = "";
    }
});

function updateAttendance(studentId, scanned) {
    fetch('update_attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: studentId,
            scanned: scanned
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Attendance updated for ID ${studentId}`);
        } else {
            console.error(`Error: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

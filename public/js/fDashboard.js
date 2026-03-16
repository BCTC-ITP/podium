document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".button-panel button");
    const buttonPanel = document.querySelector(".button-panel");
    const timerDisplay = document.getElementById("timer-display");
    let checkedOutAt = null;
    let checkoutTime = null;
    let checkoutTimer = null;
    let timerInterval = null;
    let isCheckedOut = false;
    let currentDestination = null;

    buttons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const destination = btn.textContent;

            try {
                if (!isCheckedOut) {
                    // First click: Check OUT (leaving classroom)
                    checkedOutAt = Date.now();
                    const now = new Date();
                    checkoutTime = now.toLocaleTimeString('en-US', { hour12: false });
                    isCheckedOut = true;
                    currentDestination = destination;

                    // Highlight the active button
                    buttons.forEach(b => b.classList.remove("active-btn"));
                    btn.classList.add("active-btn");

                    // Send check-out request
                    const response = await fetch('/dashboard/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ destination })
                    });
                    const data = await response.json();

                    if (data.success) {
                        alert(data.message);
                        
                        // Hide all buttons except the destination they're at
                        buttons.forEach(b => {
                            if (b.textContent === destination) {
                                b.style.display = "block";
                            } else {
                                b.style.display = "none";
                            }
                        });

                        // Center the button panel
                        buttonPanel.style.justifyContent = "center";
                        
                        // Show timer
                        if (timerDisplay) {
                            timerDisplay.style.display = "block";
                        }
                        
                        // Clear any existing timer
                        if (checkoutTimer) clearTimeout(checkoutTimer);
                        if (timerInterval) clearInterval(timerInterval);
                        
                        // Start timer display
                        updateTimer();
                        timerInterval = setInterval(updateTimer, 1000);
                        
                        // Start 20-minute timer for auto-check-in
                        checkoutTimer = setTimeout(async () => {
                            try {
                                const checkinResponse = await fetch('/dashboard/auto-checkin', { method: 'POST' });
                                const checkinData = await checkinResponse.json();

                                if (checkinData.success) {
                                    isCheckedOut = false;
                                    currentDestination = null;
                                    if (timerInterval) clearInterval(timerInterval);
                                    if (timerDisplay) timerDisplay.style.display = "none";
                                    window.location.href = checkinData.redirect || '/checkout';
                                } else {
                                    console.error('Auto check-in failed:', checkinData.message);
                                }
                            } catch (err) {
                                console.error('Auto check-in error:', err);
                            }
                        }, 20 * 60 * 1000); // 20 minutes
                    } else {
                        alert('Error: ' + data.message);
                        isCheckedOut = false;
                    }
                } else if (isCheckedOut && destination === currentDestination) {
                    // Second click on same destination: Check IN (returning to classroom)
                    try {
                        const response = await fetch('/dashboard/checkin', { method: 'POST' });
                        const data = await response.json();

                        if (data.success) {
                            // Clear the timer since we checked in manually
                            if (checkoutTimer) clearTimeout(checkoutTimer);
                            if (timerInterval) clearInterval(timerInterval);
                            isCheckedOut = false;
                            currentDestination = null;
                            checkoutTime = null;
                            // Redirect immediately to checkout page
                            window.location.href = data.redirect || '/checkout';
                        } else {
                            alert('Error: ' + data.message);
                        }
                    } catch (err) {
                        console.error('Check-in error:', err);
                        alert('Something went wrong during check-in.');
                    }
                } else {
                    alert('You are already checked out. Click ' + currentDestination + ' to check back in.');
                }
            } catch (err) {
                console.error(err);
                alert('Something went wrong. Please try again.');
            }
        });
    });

    function updateTimer() {
        if (!checkedOutAt || !timerDisplay) return;
        
        const elapsed = Date.now() - checkedOutAt;
        const remaining = Math.max(0, 20 * 60 * 1000 - elapsed);
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        timerDisplay.innerHTML = `<div style="margin-bottom: 10px;">Left at: ${checkoutTime}</div><div>Time until auto check-in: ${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    }
});

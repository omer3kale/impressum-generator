document.addEventListener("DOMContentLoaded", () => {
    const bookingForm = document.getElementById("booking-form");
    const availableTimesList = document.getElementById("available-times");
    const dateInput = document.getElementById("date");

    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const selectedDate = dateInput.value;
        if (!selectedDate) {
            alert("Bitte wählen Sie ein gültiges Datum.");
            return;
        }
        fetchAvailableTimes(selectedDate);
    });

    function fetchAvailableTimes(date) {
        fetch(`/api/available-times?date=${date}`)
            .then(response => response.json())
            .then(data => displayAvailableTimes(data.times))
            .catch(error => {
                console.error("Fehler beim Abrufen der verfügbaren Zeiten:", error);
                alert("Fehler beim Laden der verfügbaren Zeiten.");
            });
    }

    function displayAvailableTimes(times) {
        availableTimesList.innerHTML = "";
        if (times.length === 0) {
            availableTimesList.innerHTML = "<li>Keine verfügbaren Zeiten an diesem Tag.</li>";
            return;
        }
        times.forEach(time => {
            const listItem = document.createElement("li");
            listItem.textContent = time;
            listItem.addEventListener("click", () => confirmBooking(time));
            availableTimesList.appendChild(listItem);
        });
    }

    function confirmBooking(time) {
        const date = dateInput.value;
        if (!date) {
            alert("Bitte wählen Sie ein gültiges Datum.");
            return;
        }
        fetch("/api/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ date, time })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Vielen Dank für Ihre Buchung!");
            } else {
                alert("Fehler bei der Buchung. Bitte versuchen Sie es erneut.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Senden der Buchung:", error);
            alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
        });
    }
});
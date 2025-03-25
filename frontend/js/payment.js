document.addEventListener("DOMContentLoaded", () => {
    console.log("Payment page loaded");

    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const paymentMethod = document.getElementById("payment-method").value;
            console.log("Selected payment method:", paymentMethod);
            
            try {
                const response = await fetch("/api/process-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ paymentMethod })
                });
                
                const data = await response.json();
                if (data.success) {
                    alert("Zahlung erfolgreich! Ihre Buchung ist bestätigt.");
                    window.location.href = "confirmation.html";
                } else {
                    alert("Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.");
                }
            } catch (error) {
                console.error("Fehler beim Verarbeiten der Zahlung:", error);
                alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
            }
        });
    }
});
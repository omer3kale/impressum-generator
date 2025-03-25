document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded successfully!");

    const bookNowButton = document.querySelector(".button");
    if (bookNowButton) {
        bookNowButton.addEventListener("click", () => {
            window.location.href = "booking.html";
        });
    }

    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetPage = link.getAttribute("href");
            window.location.href = targetPage;
        });
    });

    // Smooth scrolling effect for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(event) {
            event.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Add fade-in effect on page load
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 1.5s ease-in-out";
    window.addEventListener("load", () => {
        document.body.style.opacity = 1;
    });
});
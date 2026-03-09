// c:\Users\ABC\Desktop\NIPOON Clothing\js\main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden'); // Prevent scrolling
        });

        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
            navbar.classList.replace('py-4', 'py-3');
        } else {
            navbar.classList.remove('shadow-sm');
            navbar.classList.replace('py-3', 'py-4');
        }
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load
});

// --- WhatsApp Order Integration ---
function buyNow(productId, productName, price) {
    // Get the selected size and color for this specific product
    const sizeElement = document.getElementById(`size-${productId}`);
    const colorElement = document.getElementById(`color-${productId}`);
    
    // Default values if they haven't made a selection (though we'll select the first option by default in HTML)
    const size = sizeElement ? sizeElement.value : 'M'; 
    const color = colorElement ? colorElement.value : 'Midnight Black';

    const phoneNumber = '+94768015731'; // Store phone number
    const welcomeMessage = `Hello NIPOON Clothing! 👋\n\nI would like to place an order for:\n\n🛍️ *Product:* ${productName}\n📏 *Size:* ${size}\n🎨 *Color:* ${color}\n💰 *Price:* ${price}\n\n*My Details:*\nName:\nDelivery Address:\nContact Number:\n\n*Payment Method (Please choose one):*\n1. Bank Transfer\n2. Cash on Delivery (COD)\n\nPlease let me know the total amount including delivery charges. Thank you!`;
    const encodedMessage = encodeURIComponent(welcomeMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
}

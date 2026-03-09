// c:\Users\ABC\Desktop\NIPOON Clothing\js\main.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('hidden');
                setTimeout(() => mobileOverlay.classList.remove('opacity-0'), 10);
            }
            document.body.classList.add('overflow-hidden');
        });

        const closeMenu = () => {
            mobileMenu.classList.add('translate-x-full');
            if (mobileOverlay) {
                mobileOverlay.classList.add('opacity-0');
                setTimeout(() => mobileOverlay.classList.add('hidden'), 300);
            }
            document.body.classList.remove('overflow-hidden');
        };

        closeMenuBtn.addEventListener('click', closeMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
    }

    // --- Mobile Filter Toggle ---
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const filterDrawer = document.getElementById('filter-drawer');
    const filterOverlay = document.getElementById('filter-overlay');

    if (mobileFilterBtn && closeFilterBtn && filterDrawer && filterOverlay) {
        mobileFilterBtn.addEventListener('click', () => {
            filterDrawer.classList.remove('translate-x-full');
            filterOverlay.classList.remove('hidden');
            setTimeout(() => filterOverlay.classList.remove('opacity-0'), 10);
            document.body.classList.add('overflow-hidden');
        });

        const closeFilter = () => {
            filterDrawer.classList.add('translate-x-full');
            filterOverlay.classList.add('opacity-0');
            setTimeout(() => filterOverlay.classList.add('hidden'), 300);
            document.body.classList.remove('overflow-hidden');
        };

        closeFilterBtn.addEventListener('click', closeFilter);
        filterOverlay.addEventListener('click', closeFilter);
    }

    // --- Cart Drawer Toggle ---
    const cartDrawerBtn = document.getElementById('cart-drawer-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartDrawerBtn && closeCartBtn && cartDrawer && cartOverlay) {
        const openCart = () => {
            cartDrawer.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
            setTimeout(() => cartOverlay.classList.remove('opacity-0'), 10);
            document.body.classList.add('overflow-hidden');
            renderCart();
        };

        const closeCart = () => {
            cartDrawer.classList.add('translate-x-full');
            cartOverlay.classList.add('opacity-0');
            setTimeout(() => cartOverlay.classList.add('hidden'), 500);
            document.body.classList.remove('overflow-hidden');
        };

        cartDrawerBtn.addEventListener('click', openCart);
        closeCartBtn.addEventListener('click', closeCart);
        cartOverlay.addEventListener('click', closeCart);
    }

    // --- Search Interaction ---
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    const searchButtons = document.querySelectorAll('button:has(.fa-magnifying-glass), button .fa-magnifying-glass');
    
    const performSearch = (query) => {
        if (query.trim() !== '') {
            window.location.href = `shop.html?search=${encodeURIComponent(query.trim())}`;
        }
    };

    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(input.value);
        });
    });

    searchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            if (input) performSearch(input.value);
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-md');
            } else {
                navbar.classList.remove('shadow-md');
            }
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
    revealOnScroll();

    // --- Cart Logic (LocalStorage) ---
    let cart = JSON.parse(localStorage.getItem('nipoon_cart')) || [];

    function updateCartCount() {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        const badges = document.querySelectorAll('#cart-drawer-btn span.bg-red-600, #cart-count-badge-drawer');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        });
    }

    window.addToCart = function(id, name, price, image) {
        const size = document.getElementById(`size-${id}`)?.value || 'M';
        const color = document.getElementById(`color-${id}`)?.value || 'Default';
        const existingItem = cart.find(item => item.id === id && item.size === size && item.color === color);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, image, size, color, quantity: 1 });
        }
        localStorage.setItem('nipoon_cart', JSON.stringify(cart));
        updateCartCount();
        const cartDrawerBtn = document.getElementById('cart-drawer-btn');
        if (cartDrawerBtn) cartDrawerBtn.click();
    };

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-msg');
        const footer = document.getElementById('cart-footer');
        const subtotalEl = document.getElementById('cart-subtotal');
        if (!container) return;
        if (cart.length === 0) {
            container.innerHTML = '';
            if (emptyMsg) emptyMsg.classList.remove('hidden');
            if (footer) footer.classList.add('hidden');
            return;
        }
        if (emptyMsg) emptyMsg.classList.add('hidden');
        if (footer) footer.classList.remove('hidden');
        container.innerHTML = cart.map((item, index) => `
            <div class="flex gap-4 border-b border-gray-50 pb-4">
                <div class="w-20 h-24 bg-gray-50 flex-shrink-0 rounded overflow-hidden">
                    <img src="${item.image || 'images/tshirt-flat.jpg'}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 space-y-1">
                    <div class="flex justify-between">
                        <h4 class="font-bold text-sm text-brand-950">${item.name}</h4>
                        <button onclick="removeFromCart(${index})" class="text-gray-400 hover:text-red-500"><i class="fa-solid fa-trash-can text-xs"></i></button>
                    </div>
                    <p class="text-[10px] text-gray-500 uppercase">${item.size} / ${item.color}</p>
                    <div class="flex justify-between items-end pt-2">
                        <div class="flex items-center border border-gray-200 rounded">
                            <button onclick="updateQty(${index}, -1)" class="px-2 py-1 text-xs hover:bg-gray-100">-</button>
                            <span class="px-2 py-1 text-xs font-bold border-x border-gray-200">${item.quantity}</span>
                            <button onclick="updateQty(${index}, 1)" class="px-2 py-1 text-xs hover:bg-gray-100">+</button>
                        </div>
                        <span class="font-bold text-sm text-brand-950">${item.price}</span>
                    </div>
                </div>
            </div>`).join('');
        const subtotal = cart.reduce((acc, item) => acc + (parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity), 0);
        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString()}`;
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('nipoon_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    window.updateQty = function(index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        localStorage.setItem('nipoon_cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    updateCartCount();
});

// --- WhatsApp Order Integration ---
function buyNow(productId, productName, price) {
    const size = document.getElementById(`size-${productId}`)?.value || 'M';
    const color = document.getElementById(`color-${productId}`)?.value || 'Default';
    const phoneNumber = '+94768015731';
    const welcomeMessage = `Hello NIPOON Clothing! 👋\n\nI would like to place an order for:\n\n🛍️ *Product:* ${productName}\n📏 *Size:* ${size}\n🎨 *Color:* ${color}\n💰 *Price:* ${price}\n\n*My Details:*\nName:\nDelivery Address:\nContact Number:\n\n*Payment Method (Please choose one):*\n1. Bank Transfer\n2. Cash on Delivery (COD)\n\nPlease let me know the total amount including delivery charges. Thank you!`;
    const encodedMessage = encodeURIComponent(welcomeMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

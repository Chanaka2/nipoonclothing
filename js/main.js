// c:\Users\ABC\Desktop\NIPOON Clothing\js\main.js

// --- Global Cart State ---
let cart = JSON.parse(localStorage.getItem('nipoon_cart')) || [];

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
        const btn = input.nextElementSibling; // The magnifying glass button
        const handleSearch = () => performSearch(input.value);
        
        btn?.addEventListener('click', handleSearch);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
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

    // --- Search Query Handler (For Shop Page) ---
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery && window.location.pathname.includes('shop.html')) {
        const query = searchQuery.toLowerCase();
        const productCards = document.querySelectorAll('.group.reveal');
        let foundCount = 0;

        productCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const category = card.querySelector('p')?.textContent.toLowerCase() || '';
            if (title.includes(query) || category.includes(query)) {
                card.style.display = 'block';
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Add a "Results for..." header if it doesn't exist
        const gridHeader = document.querySelector('.flex.justify-between.items-end.mb-10');
        if (gridHeader) {
            const resultsTitle = document.createElement('div');
            resultsTitle.className = 'w-full mb-6 py-2 border-b border-gray-200';
            resultsTitle.innerHTML = `
                <p class="text-sm text-gray-500">Showing ${foundCount} results for "<span class="font-bold text-brand-950">${searchQuery}</span>"</p>
                <a href="shop.html" class="text-xs text-brand-500 hover:text-brand-950 underline mt-1 inline-block">Clear Search</a>
            `;
            gridHeader.insertAdjacentElement('afterend', resultsTitle);
        }
    }

    // --- Cart Logic (LocalStorage) ---
    // cart is global now

    updateCartCount();

    // --- Toast System ---
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    window.showToast = function(message, icon = 'fa-circle-check') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    window.addToCart = function(id, name, price, image, size, color) {
        const finalSize = size || 'M';
        const finalColor = color || 'Default';
        
        const existingItem = cart.find(item => item.id === id && item.size === finalSize && item.color === finalColor);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, image, size: finalSize, color: finalColor, quantity: 1 });
        }
        localStorage.setItem('nipoon_cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`Added ${name} to bag`);
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
        const subtotal = cart.reduce((acc, item) => {
            const price = parseFloat(item.price.replace('Rs.', '').replace(',', '').trim());
            return acc + (price * item.quantity);
        }, 0);
        if (subtotalEl) subtotalEl.textContent = `Rs. ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

    // --- Product Data ---
    const productsData = {
        'sale-p1': {
            name: 'Premium Oversized Tee',
            price: 'Rs. 1,800',
            category: 'T-Shirts',
            image: 'images/tshirt-flat.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Midnight Black', 'Off White', 'Sage Green'],
            description: 'Experience ultimate comfort with our signature heavyweight cotton oversized tee. Features a relaxed fit and dropped shoulders for that perfect streetwear silhouette.'
        },
        'reco-1': {
            name: 'Graphic Print Oversized Tee',
            price: 'Rs. 2,200',
            category: 'T-Shirts',
            image: 'images/tshirt-flat.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'White', 'Charcoal'],
            description: 'Street-ready graphic tee with a bold print. Crafted from 100% premium cotton for a soft feel and durable wear.'
        },
        'shop-p1': {
            name: 'Raksha Mask T-Shirt',
            price: 'Rs. 1,999.00',
            category: 'T-Shirts',
            image: 'images/tshirt-model.png',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy'],
            description: 'A fusion of traditional Sri Lankan art and modern streetwear. The Raksha Mask print is a statement of culture and style.'
        },
        'twoton-1': {
            name: 'Two-Ton Signature Tee (Black/White)',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (1).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'The iconic Two-Ton Signature Tee. A perfect blend of two contrasting premium fabrics for a unique, modern streetwear look.'
        },
        'twoton-2': {
            name: 'Two-Tone Urban Tee (Grey/Charcoal)',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (2).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'A subtle yet bold two-tone design crafted for the urban explorer. Premium heavyweight cotton.'
        },
        'twoton-3': {
            name: 'Two-Tone Essential Tee (Beige/Tan)',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (3).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'Earth tones meet modern design. This tan and beige two-tone tee is a versatile staple for any wardrobe.'
        },
        'twoton-4': {
            name: 'Two-Tone Midnight Tee',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (4).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'A deep midnight blue and black contrast that subtle yet striking.'
        },
        'twoton-5': {
            name: 'Two-Tone Slate Tee',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (5).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'Slate grey and charcoal contrast for a sleek and modern aesthetic.'
        },
        'twoton-6': {
            name: 'Two-Tone Forest Tee',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (6).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'Forest green and olive contrast, bringing a touch of nature to streetwear.'
        },
        'twoton-7': {
            name: 'Two-Tone Crimson Tee',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (7).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'Bold crimson and maroon contrast for those who want to stand out.'
        },
        'twoton-8': {
            name: 'Two-Tone Royal Tee',
            price: 'Rs. 999.00',
            category: 'T-Shirts',
            image: 'images/two ton t-shirt (8).png',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Two-Tone'],
            description: 'Royal blue and navy contrast for a premium feel.'
        },
        'shop-p2': {
            name: 'Minimalist Hoodie',
            price: 'Rs. 4,500.00',
            category: 'Outerwear',
            image: 'images/product2.png',
            sizes: ['M', 'L', 'XL'],
            colors: ['Grey', 'Black'],
            description: 'Clean lines and premium fleece. This minimalist hoodie is the perfect layer for any urban explorer.'
        }
    };

    // --- Quick View Logic ---
    const qvModal = document.getElementById('quick-view-modal');
    const qvOverlay = document.getElementById('quick-view-overlay');
    const qvContent = qvModal?.querySelector('.bg-white');
    const closeQVBtn = document.getElementById('close-quick-view');
    
    let currentQVProduct = null;
    let selectedQVSize = 'M';
    let selectedQVColor = '';
    let qvQty = 1;

    window.openQuickView = function(id) {
        const product = productsData[id] || {
            name: 'NIPOON Essential Item',
            price: 'Rs. 2,500',
            category: 'Collection',
            image: 'images/tshirt-flat.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'White'],
            description: 'A must-have staple for your wardrobe. High-quality construction and evergreen design.'
        };

        currentQVProduct = { ...product, id };
        selectedQVSize = product.sizes[0];
        selectedQVColor = product.colors[0];
        qvQty = 1;

        // Update UI
        document.getElementById('qv-image').src = product.image;
        document.getElementById('qv-title').textContent = product.name;
        document.getElementById('qv-price').textContent = product.price;
        document.getElementById('qv-category').textContent = product.category;
        document.getElementById('qv-description').textContent = product.description;
        document.getElementById('qv-qty').textContent = qvQty;
        
        renderQVOptions(product);

        // Show Modal
        qvModal.classList.remove('hidden');
        setTimeout(() => {
            qvOverlay.classList.remove('opacity-0');
            qvContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
        document.body.classList.add('overflow-hidden');
    };

    function renderQVOptions(product) {
        const sizeContainer = document.getElementById('qv-sizes');
        const colorContainer = document.getElementById('qv-colors');
        const sizeLabel = document.getElementById('qv-selected-size');
        const colorLabel = document.getElementById('qv-selected-color');

        sizeLabel.textContent = selectedQVSize;
        colorLabel.textContent = selectedQVColor;

        sizeContainer.innerHTML = product.sizes.map(size => `
            <button onclick="selectQVSize('${size}')" class="w-12 h-12 border ${selectedQVSize === size ? 'border-brand-950 bg-brand-950 text-white' : 'border-gray-200 hover:border-gray-400'} font-bold transition-all rounded-sm flex items-center justify-center text-sm">
                ${size}
            </button>
        `).join('');

        colorContainer.innerHTML = product.colors.map(color => `
            <button onclick="selectQVColor('${color}')" title="${color}" class="w-8 h-8 rounded-full border-2 ${selectedQVColor === color ? 'border-brand-950 scale-110' : 'border-transparent hover:scale-105'} transition-all" style="background-color: ${getColorHex(color)}"></button>
        `).join('');
    }

    function getColorHex(name) {
        const map = { 'Black': '#000', 'White': '#fff', 'Sage Green': '#87a96b', 'Midnight Black': '#1a1a1a', 'Off White': '#faf9f6', 'Charcoal': '#36454f' };
        return map[name] || '#ccc';
    }

    window.selectQVSize = function(size) {
        selectedQVSize = size;
        renderQVOptions(currentQVProduct);
    };

    window.selectQVColor = function(color) {
        selectedQVColor = color;
        renderQVOptions(currentQVProduct);
    };

    window.updateQVQty = function(delta) {
        qvQty += delta;
        if (qvQty < 1) qvQty = 1;
        document.getElementById('qv-qty').textContent = qvQty;
    };

    const closeQV = () => {
        qvOverlay.classList.add('opacity-0');
        qvContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => qvModal.classList.add('hidden'), 300);
        document.body.classList.remove('overflow-hidden');
    };

    if (closeQVBtn) closeQVBtn.addEventListener('click', closeQV);
    if (qvOverlay) qvOverlay.addEventListener('click', closeQV);

    // Modal Actions
    document.getElementById('qv-add-btn')?.addEventListener('click', () => {
        for (let i = 0; i < qvQty; i++) {
            addToCart(currentQVProduct.id, currentQVProduct.name, currentQVProduct.price, currentQVProduct.image, selectedQVSize, selectedQVColor);
        }
        closeQV();
    });

    document.getElementById('qv-buy-btn')?.addEventListener('click', () => {
        buyNow(currentQVProduct.id, currentQVProduct.name, currentQVProduct.price, selectedQVSize, selectedQVColor);
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const name = `${formData.get('first-name') || ''} ${formData.get('last-name') || ''}`.trim();
            
            // Show success state
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
            btn.classList.replace('bg-brand-950', 'bg-green-600');
            
            setTimeout(() => {
                contactForm.reset();
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.classList.replace('bg-green-600', 'bg-brand-950');
            }, 3000);
        });
    }

    // --- Newsletter Submission ---
    const newsletterForms = document.querySelectorAll('footer form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.disabled = true;
            btn.textContent = 'Subscribed!';
            btn.classList.replace('bg-white', 'bg-green-600');
            btn.classList.replace('text-brand-950', 'text-white');
            
            setTimeout(() => {
                input.value = '';
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.classList.replace('bg-green-600', 'bg-white');
                btn.classList.replace('text-white', 'text-brand-950');
            }, 3000);
        });
    });
});

// --- WhatsApp Order Integration ---
window.buyNow = function(productId, productName, price, size, color) {
    const finalSize = size || 'M';
    const finalColor = color || 'Default';
    
    const phoneNumber = '+94768015731';
    const welcomeMessage = `Hello NIPOON Clothing! 👋\n\nI would like to place an order for:\n\n🛍️ *Product:* ${productName}\n📏 *Size:* ${finalSize}\n🎨 *Color:* ${finalColor}\n💰 *Price:* ${price}\n\n*My Details:*\nName:\nDelivery Address:\nContact Number:\n\n*Payment Method (Please choose one):*\n1. Bank Transfer\n2. Cash on Delivery (COD)\n\nPlease let me know the total amount including delivery charges. Thank you!`;
    const encodedMessage = encodeURIComponent(welcomeMessage);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

window.checkoutWhatsApp = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // If we are already on checkout.html, this function will be called with data from the form
    // If not, redirect to checkout.html
    if (window.location.pathname.includes('checkout.html')) {
        placeFinalOrder();
    } else {
        window.location.href = 'checkout.html';
    }
};

function placeFinalOrder() {
    const name = document.getElementById('checkout-name')?.value || 'Not provided';
    const address = document.getElementById('checkout-address')?.value || 'Not provided';
    const phone = document.getElementById('checkout-phone')?.value || 'Not provided';
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'Not selected';

    const phoneNumber = '+94768015731';
    let message = `Hello NIPOON Clothing! 👋\n\nI would like to place an order:\n\n*CUSTOMER DETAILS:*\n👤 Name: ${name}\n📍 Address: ${address}\n📞 Phone: ${phone}\n💳 Payment: ${payment}\n\n*ORDER SUMMARY:*\n`;
    
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price.replace('Rs.', '').replace(',', '').trim());
        const totalItemPrice = itemPrice * item.quantity;
        subtotal += totalItemPrice;
        message += `${index + 1}. *${item.name}*\n   Size: ${item.size} | Color: ${item.color}\n   Qty: ${item.quantity} | Price: ${item.price}\n\n`;
    });

    message += `💰 *Subtotal:* Rs. ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
    message += `Please confirm my order and let me know the total with delivery. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Logic for checkout page specifically
if (window.location.pathname.includes('checkout.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderCheckoutSummary();
        const form = document.getElementById('checkout-form');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            placeFinalOrder();
        });
    });
}

function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-summary-items');
    const totalEl = document.getElementById('checkout-summary-total');
    if (!summaryList || !totalEl) return;

    summaryList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemPrice = parseFloat(item.price.replace('Rs.', '').replace(',', '').trim());
        total += itemPrice * item.quantity;

        summaryList.innerHTML += `
            <div class="flex justify-between items-center py-3 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-12 h-12 object-cover rounded shadow-sm">
                    <div>
                        <h4 class="text-sm font-bold text-brand-900">${item.name}</h4>
                        <p class="text-[10px] text-gray-500">${item.size} / ${item.color} (x${item.quantity})</p>
                    </div>
                </div>
                <span class="text-sm font-bold text-brand-950">${item.price}</span>
            </div>
        `;
    });

    totalEl.textContent = `Rs. ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

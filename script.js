let cart = [];

function addToCart(name, price, image = '') {
    const existingItem = cart.find(item => item.name === name && item.price === price);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, id: Date.now(), quantity: 1 });
    }
    displayCart();
    showCartFeedback();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    displayCart();
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            displayCart();
        }
    }
}

function showCartFeedback() {
    const btn = document.querySelector('.btn-cart');
    btn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

function displayCart() {
    let cartList = document.getElementById("cart-items");
    let totalElement = document.getElementById("cart-total");
    let countElement = document.getElementById("cart-count");
    
    countElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><button class="btn-shop" onclick="toggleCart()">Continue Shopping</button></div>';
        totalElement.textContent = '0.00';
        document.getElementById("cart-upsell").style.display = 'none';
        return;
    }
    
    cartList.innerHTML = "";
    let subtotal = 0;
    
    cart.forEach((item) => {
        let li = document.createElement("li");
        li.className = "cart-item";
        const itemTotal = item.price * item.quantity;
        li.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)} (${item.quantity}x)</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)" style="background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%) !important; color: #000 !important; padding: 14px 40px !important; border-radius: 8px !important; border: none !important; cursor: pointer !important; font-weight: 700 !important; font-size: 16px !important; text-transform: uppercase !important; letter-spacing: 1px !important;">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)" style="background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%) !important; color: #000 !important; padding: 14px 40px !important; border-radius: 8px !important; border: none !important; cursor: pointer !important; font-weight: 700 !important; font-size: 16px !important; text-transform: uppercase !important; letter-spacing: 1px !important;">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartList.appendChild(li);
        subtotal += itemTotal;
    });
    
    const shipping = subtotal >= 40 ? 0 : 5;
    const total = subtotal + shipping;
    const upsellDiv = document.getElementById("cart-upsell");
    const upsellMessage = document.getElementById("upsell-message");
    if (subtotal >= 40) {
        upsellMessage.textContent = "You've earned free shipping!";
        upsellDiv.style.display = 'block';
    } else if (subtotal > 0) {
        const amountNeeded = (40 - subtotal).toFixed(2);
        upsellMessage.textContent = `You only need $${amountNeeded} more for free shipping!`;
        upsellDiv.style.display = 'block';
    } else {
        upsellDiv.style.display = 'none';
    }
    totalElement.textContent = total.toFixed(2);
}

function toggleCart() {
    const overlay = document.getElementById("cart-overlay");
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    } else {
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    // Send cart data to server for Stripe checkout
    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.sessionId) {
            // Redirect to Stripe checkout if using Stripe
            // stripe.redirectToCheckout({ sessionId: data.sessionId });
            // For now, just redirect to success page
            window.location.href = '/success.html';
        }
    })
    .catch(error => console.error('Error:', error));
}
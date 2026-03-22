let cart = [];

function addToCart(name, price, image = '') {
    cart.push({ name, price, image, id: Date.now() });
    displayCart();
    // Show success feedback
    showCartFeedback();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    displayCart();
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
    
    countElement.textContent = cart.length;
    
    if (cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p><button class="btn-shop" onclick="toggleCart()">Continue Shopping</button></div>';
        totalElement.textContent = '5.00';
        return;
    }
    
    cartList.innerHTML = "";
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartList.appendChild(li);
        subtotal += item.price;
    });
    
    const total = subtotal + 5; // $5 shipping
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
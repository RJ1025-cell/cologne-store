let cart = [];

function addToCart(name, price){

cart.push({name, price});

displayCart();

}

function displayCart(){

let cartList = document.getElementById("cart-items");

cartList.innerHTML = "";

let total = 0;

cart.forEach(item => {

let li = document.createElement("li");

li.textContent = item.name + " - $" + item.price;

cartList.appendChild(li);

total += item.price;

});

let totalItem = document.createElement("li");

totalItem.textContent = "Total: $" + total;

cartList.appendChild(totalItem);

}
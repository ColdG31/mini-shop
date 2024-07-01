const products = [
  { id: 1, name: "Product 1", price: 10, stock: 5, image: "assets/img/product1.jpg" },
  { id: 2, name: "Product 2", price: 20, stock: 3, image: "assets/img/product2.jpg" },
  { id: 3, name: "Product 3", price: 30, stock: 2, image: "assets/img/product3.jpg" },
  { id: 4, name: "Product 4", price: 40, stock: 6, image: "assets/img/product4.jpg" },
  { id: 5, name: "Product 5", price: 50, stock: 4, image: "assets/img/product5.jpg" },
  { id: 6, name: "Product 6", price: 60, stock: 7, image: "assets/img/product6.jpg" },
];

const cart = [];

function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="product-card card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
                <p class="card-text">Stock: ${product.stock}</p>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>${product.stock === 0 ? "Out of Stock" : "Add to Cart"}</button>
            </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      addToCart(productId);
    });
  });
}

function renderCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = cart
    .map(
      (item) => `
        <li class="cart-item">
          <img src="${products.find(p => p.id === item.id).image}" alt="${item.name}">
          <div class="cart-item-details">
            <div>${item.name}</div>
            <div class="cart-item-quantity">
              <div class="quantity-control">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
              </div>
            </div>
            <div class="cart-item-total">Total: $${item.price * item.quantity}</div>
          </div>
          <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.id}">Remove All</button>
        </li>
      `
    )
    .join("");

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      removeOneFromCart(productId);
    });
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      addToCart(productId);
    });
  });

  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.getAttribute("data-id"));
      removeAllFromCart(productId);
    });
  });

  renderFloatingCart();
  updateCartCount();
}

function renderFloatingCart() {
  const floatingCart = document.getElementById("floating-cart");
  if (cart.length === 0) {
    floatingCart.innerHTML = "";
  } else {
    floatingCart.innerHTML = cart
      .map(
        (item) => `
          <div class="floating-cart-item">
              <img src="${products.find(p => p.id === item.id).image}" alt="${item.name}">
              <div class="floating-cart-item-name">${item.name}</div>
          </div>
        `
      )
      .join("");
    floatingCart.innerHTML += '<button class="btn btn-primary mt-2" id="scroll-to-checkout">Checkout</button>';
    document.getElementById("scroll-to-checkout").addEventListener("click", () => {
      document.getElementById("viewcart").scrollIntoView({ behavior: "smooth" });
    });
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product.stock === 0) {
    alert(`No more stock available for ${product.name}.`);
    return;
  }
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  product.stock--;

  renderCart();
  renderProducts();
  updateCartCount();
}

function removeOneFromCart(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      const index = cart.indexOf(cartItem);
      cart.splice(index, 1);
    }
    const product = products.find((p) => p.id === productId);
    product.stock++;
  }
  renderCart();
  renderProducts();
  updateCartCount();
}

function removeAllFromCart(productId) {
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    const product = products.find((p) => p.id === productId);
    product.stock += cartItem.quantity;
    const index = cart.indexOf(cartItem);
    cart.splice(index, 1);
  }
  renderCart();
  renderProducts();
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartCount.style.display = totalItems === 0 ? "none" : "inline";
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  showModal(`Your total is $${total}. Thank you for your purchase!`, () => {
    cart.length = 0;
    renderCart();
    renderProducts();
    updateCartCount();
  });
}

function emptyCart() {
  showModal("Are you sure you want to empty the cart?", () => {
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      product.stock += item.quantity;
    });
    cart.length = 0;
    renderCart();
    renderProducts();
    updateCartCount();
    document.getElementById("product-list").scrollIntoView({ behavior: "smooth" });
  });
}

function showModal(message, confirmCallback) {
  const modal = new bootstrap.Modal(document.getElementById("confirmModal"));
  document.getElementById("confirmModalLabel").textContent = "Confirm Action";
  document.querySelector(".modal-body p").textContent = message;
  document.getElementById("confirm-btn").onclick = () => {
    confirmCallback();
    modal.hide();
  };
  modal.show();
}

document.getElementById("checkout-btn").addEventListener("click", checkout);
document.getElementById("empty-cart-btn").addEventListener("click", emptyCart);
document.getElementById("viewcart-link").addEventListener("click", () => {
  document.getElementById("viewcart").scrollIntoView({ behavior: "smooth" });
});

renderProducts();
updateCartCount();

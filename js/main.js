(function () {
  const PRODUCTS = [
    { id: "brie", name: "Brie Mine 4Ever", price: 16.99, type: "Book" },
    { id: "glory", name: "Glory Riders", price: 18.50, type: "Book" },
    { id: "sorcerer", name: "Sorcerer's Shadowed Chronicles", price: 21.00, type: "Book" },
    { id: "ball", name: "Ball", price: 7.99, type: "Magazine" },
    { id: "travel", name: "Travel", price: 8.50, type: "Magazine" },
    { id: "eat", name: "Eat.", price: 8.25, type: "Magazine" },
    { id: "tote", name: "ALL I DO IS READ Tote", price: 14.00, type: "Merchandise" },
    { id: "notebook", name: "Book Haven Notebook", price: 9.50, type: "Merchandise" },
    { id: "stickers", name: "Reading Sticker Set", price: 5.00, type: "Merchandise" }
  ];

  function getCart() {
    try {
      return JSON.parse(sessionStorage.getItem("bh_cart") || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    sessionStorage.setItem("bh_cart", JSON.stringify(cart));
  }

  function addToCart(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    saveCart(cart);
    window.alert("Item added.");
  }

  function renderCart() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;
    const cart = getCart();
    if (!cart.length) {
      list.innerHTML = "<p>Your cart is empty.</p>";
      totalEl.textContent = "$0.00";
      return;
    }
    list.innerHTML = cart
      .map(
        (i) =>
          `<p>${i.name} × ${i.qty} — $${(i.price * i.qty).toFixed(2)}</p>`
      )
      .join("");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    totalEl.textContent = "$" + total.toFixed(2);
  }

  document.addEventListener("click", function (e) {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      addToCart(addBtn.getAttribute("data-add"));
    }
    if (e.target.id === "view-cart" || e.target.closest("#view-cart")) {
      document.getElementById("cart-modal").classList.add("open");
      document.getElementById("cart-modal").setAttribute("aria-hidden", "false");
      renderCart();
    }
    if (e.target.id === "close-cart") {
      document.getElementById("cart-modal").classList.remove("open");
      document.getElementById("cart-modal").setAttribute("aria-hidden", "true");
    }
    if (e.target.id === "clear-cart") {
      const cart = getCart();
      if (!cart.length) {
        window.alert("Your cart is already empty.");
        return;
      }
      sessionStorage.removeItem("bh_cart");
      renderCart();
      window.alert("Cart cleared.");
    }
    if (e.target.id === "process-order") {
      if (sessionStorage.getItem("bh_order_processed") === "true") {
        window.alert("Your order has already been processed.");
        return;
      }
      const cart = getCart();
      if (!cart.length) {
        window.alert("Your cart is empty.");
        return;
      }
      sessionStorage.setItem("bh_order_processed", "true");
      sessionStorage.removeItem("bh_cart");
      renderCart();
      window.alert("Thank you for your order.");
    }
  });

  const subscribeForms = document.querySelectorAll(".subscribe-form");
  subscribeForms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]');
      const err = form.querySelector(".subscribe-error");
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !pattern.test(email.value)) {
        if (err) err.style.display = "block";
        email.focus();
        return;
      }
      if (err) err.style.display = "none";
      localStorage.setItem("bh_newsletter", email.value.trim());
      window.alert("Thank you for subscribing to the Book Haven newsletter.");
      form.reset();
    });
  });

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("full-name");
      const email = document.getElementById("contact-email");
      const message = document.getElementById("message");
      const type = document.getElementById("inquiry-type");
      let valid = true;

      function mark(el, ok) {
        el.parentElement.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      }

      mark(name, name.value.trim().length >= 2);
      mark(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
      mark(message, message.value.trim().length >= 10);
      mark(type, type.value !== "");

      if (!valid) {
        const first = contactForm.querySelector(".invalid input, .invalid textarea, .invalid select");
        if (first) first.focus();
        return;
      }

      const entry = {
        name: name.value.trim(),
        email: email.value.trim(),
        type: type.value,
        message: message.value.trim(),
        submittedAt: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem("bh_inquiries") || "[]");
      existing.push(entry);
      localStorage.setItem("bh_inquiries", JSON.stringify(existing));
      window.alert("Thank you. Your inquiry has been saved. We will contact you soon.");
      contactForm.reset();
    });
  }
})();

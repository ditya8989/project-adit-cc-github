// Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = 0;

function updateCartCount() {
  cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById('cartCount').textContent = cartCount;
}

function addToCart(item, price, qty) {
  let existing = cart.find(c => c.item === item);
  if (existing) existing.qty += qty;
  else cart.push({item, price, qty});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${item} (${qty}) ditambahkan ke keranjang!`);
}

function removeFromCart(item) {
  cart = cart.filter(c => c.item !== item);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function renderCart() {
  let itemsDiv = document.getElementById('cart-items');
  itemsDiv.innerHTML = '';
  cart.forEach(i => {
    let p = document.createElement('p');
    p.innerHTML = `${i.item} - Rp${i.price} x ${i.qty} <button onclick="removeFromCart('${i.item}')">Hapus</button>`;
    itemsDiv.appendChild(p);
  });
  let total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById('cart-total').textContent = `Total: Rp${total}`;
}

// Init cart on load
updateCartCount();

// Modal events
document.getElementById('cart-icon').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'block';
  renderCart();
});

document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('cart-modal')) {
    document.getElementById('cart-modal').style.display = 'none';
  }
});

document.getElementById('checkout-modal-btn').addEventListener('click', () => {
  if (cart.length > 0) {
    alert('Checkout berhasil! Terima kasih sudah berbelanja di Coffee Shop ☕');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    document.getElementById('cart-modal').style.display = 'none';
  } else {
    alert('Keranjang kosong!');
  }
});

// Navbar checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
  document.getElementById('cart-icon').click();
});

// Hamburger menu
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});

// Back to top
window.onscroll = () => {
  document.getElementById('back-to-top').style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? 'block' : 'none';
};

document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: 'smooth'});
});

// Dark mode toggle
const toggleBtn = document.getElementById('dark-mode-toggle');
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    toggleBtn.textContent = '☀️';
  } else {
    localStorage.removeItem('darkMode');
    toggleBtn.textContent = '🌙';
  }
});

// Subscribe form validation (only if exist in page)
if (document.getElementById('subscribe-form')) {
  document.getElementById('subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('email-input').value;
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Berlangganan berhasil! Terima kasih.');
    } else {
      alert('Email tidak valid!');
    }
  });
}

// Kode khusus menu.html (check if exist)
if (document.getElementById('search')) {
  // Add to cart buttons with quantity
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      let card = btn.closest('.card');
      let item = card.querySelector('h3').textContent;
      let price = parseInt(card.dataset.price);
      let qty = parseInt(card.querySelector('.qty-input').value);
      addToCart(item, price, qty);
    });
  });

  // Quantity selectors
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      let input = btn.nextElementSibling;
      if (input.value > 1) input.value--;
    });
  });

  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      let input = btn.previousElementSibling;
      input.value++;
    });
  });

  // Search bar
  document.getElementById('search').addEventListener('keyup', (e) => {
    let term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
      card.style.display = card.querySelector('h3').textContent.toLowerCase().includes(term) ? 'block' : 'none';
    });
  });

  // Sort select
  document.getElementById('sort-select').addEventListener('change', (e) => {
    let minumanContainer = document.getElementById('minuman-container');
    let foodContainer = document.getElementById('food-container');
    let allCards = Array.from(document.querySelectorAll('.card'));
    
    if (e.target.value === 'price-asc') {
      allCards.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
    } else if (e.target.value === 'price-desc') {
      allCards.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
    } else if (e.target.value === 'name-asc') {
      allCards.sort((a, b) => a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
    }
    
    // Re-append to respective containers
    let minumanCards = allCards.filter(card => minumanContainer.contains(card));
    let foodCards = allCards.filter(card => foodContainer.contains(card));
    minumanCards.forEach(card => minumanContainer.appendChild(card));
    foodCards.forEach(card => foodContainer.appendChild(card));
  });
}
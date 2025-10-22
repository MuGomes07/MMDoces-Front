const cartModal = document.getElementById('cart-modal');
const openCartBtn = document.getElementById('open-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const finalizePurchaseBtn = document.getElementById('finalize-purchase');
const cartSuccess = document.getElementById('cart-success');
const products = document.querySelectorAll('.btn-comprar');

let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

openCartBtn.addEventListener('click', () => {
  bootstrap.Modal.getOrCreateInstance(cartModal).show();
});

products.forEach(product => {
  product.addEventListener('click', () => {
    const card = product.closest('.card-produto');
    const id = card.dataset.id; // Agora deve funcionar, pois data-id foi adicionado
    const name = product.dataset.name;
    const price = parseFloat(product.dataset.price);
    
    // Verificar se os dados são válidos
    if (!id || !name || isNaN(price)) {
      console.error('Erro: Dados do produto inválidos', { id, name, price });
      return;
    }
    
    addToCart(id, name, price);
  });
});

function addToCart(id, name, price) {
  const existingItem = cartItems.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ id, name, price, quantity: 1 });
  }
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  updateCart();
}

function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Carrinho vazio</p>';
  } else {
    cartItems.forEach(item => {
      total += item.price * item.quantity;
      totalItems += item.quantity;
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <span>${item.name}</span>
        <span>R$ ${item.price.toFixed(2)}</span>
        <input type="number" min="1" value="${item.quantity}" data-id="${item.id}">
        <button class="btn btn-danger btn-sm" data-id="${item.id}">Excluir</button>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  cartCount.textContent = totalItems;
  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;

  // Adicionar eventos para os inputs e botões de exclusão
  document.querySelectorAll('.cart-item input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const item = cartItems.find(item => item.id === id);
      const newQuantity = parseInt(e.target.value) || 1;
      if (newQuantity < 1) {
        // Remover item se a quantidade for menor que 1
        cartItems = cartItems.filter(item => item.id !== id);
      } else {
        item.quantity = newQuantity;
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    });
  });

  document.querySelectorAll('.cart-item .btn-danger').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      cartItems = cartItems.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCart();
    });
  });
}

finalizePurchaseBtn.addEventListener('click', () => {
  if (cartItems.length === 0) {
    cartSuccess.textContent = 'O carrinho está vazio!';
    cartSuccess.classList.remove('alert-success');
    cartSuccess.classList.add('alert-warning');
    cartSuccess.classList.remove('d-none');
    setTimeout(() => {
      cartSuccess.classList.add('d-none');
    }, 3000);
  } else {
    cartSuccess.textContent = 'Compra concluída com sucesso!';
    cartSuccess.classList.remove('alert-warning');
    cartSuccess.classList.add('alert-success');
    cartSuccess.classList.remove('d-none');
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();
    setTimeout(() => {
      bootstrap.Modal.getOrCreateInstance(cartModal).hide();
      cartSuccess.classList.add('d-none');
    }, 3000);
  }
});

updateCart();
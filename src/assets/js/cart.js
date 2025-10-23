/* cart.js
Minimal vanilla JS to handle cart in localStorage.
Functions:
- addToCart: Adds an item (or increases qty)
- getCart: returns cart array
- saveCart: saves to localStorage
- renderCart: populates cart.html table
- calculateTotal: compute total
- attachAddButtons: attach event listeners to 'Adicionar' buttons
This file is intentionally small and commented for educational purposes.
*/

/* Read cart from localStorage */
function getCart(){
  try{
    return JSON.parse(localStorage.getItem('cart')) || [];
  }catch(e){
    return [];
  }
}

/* Save cart to localStorage */
function saveCart(cart){
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

/* Add item to cart. If exists, increment quantity. */
function addToCart(item){
  const cart = getCart();
  const existing = cart.find(c=>c.id===item.id);
  if(existing){
    existing.qty += 1;
  } else {
    item.qty = 1;
    cart.push(item);
  }
  saveCart(cart);
}

/* Remove an item from cart */
function removeFromCart(id){
  let cart = getCart();
  cart = cart.filter(c=>c.id !== id);
  saveCart(cart);
  renderCart();
}

/* Update quantity for an item */
function updateQuantity(id, qty){
  const cart = getCart();
  const item = cart.find(c=>c.id===id);
  if(item){
    item.qty = qty;
    if(item.qty <= 0){
      // remove if zero or less
      const filtered = cart.filter(c=>c.id!==id);
      saveCart(filtered);
    } else {
      saveCart(cart);
    }
  }
  renderCart();
}

/* Calculate total price */
function calculateTotal(){
  const cart = getCart();
  return cart.reduce((s,it)=>s + (it.price * it.qty), 0);
}

/* Render cart page table rows */
function renderCart(){
  const tbody = document.getElementById('cart-items');
  if(!tbody) return; // not on cart page
  const cart = getCart();
  if(cart.length === 0){
    tbody.innerHTML = '<tr><td colspan="5">O carrinho está vazio.</td></tr>';
  } else {
    tbody.innerHTML = '';
    cart.forEach(it=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${it.image}" alt="${it.name}" style="width:64px;height:64px;object-fit:cover;border-radius:6px;">
            <div>${it.name}</div>
          </div>
        </td>
        <td>€ ${it.price.toFixed(2)}</td>
        <td>
          <input type="number" min="0" value="${it.qty}" class="form-control form-control-sm qty-input" data-id="${it.id}" style="width:100px;">
        </td>
        <td>€ ${(it.price*it.qty).toFixed(2)}</td>
        <td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${it.id}">Remover</button></td>
      `;
      tbody.appendChild(tr);
    });
    // add listeners
    document.querySelectorAll('.qty-input').forEach(inp=>{
      inp.addEventListener('change', e=>{
        const id = e.target.dataset.id;
        const qty = parseInt(e.target.value) || 0;
        updateQuantity(id, qty);
      });
    });
    document.querySelectorAll('.remove-btn').forEach(b=>{
      b.addEventListener('click', e=>{
        removeFromCart(e.target.dataset.id);
      });
    });
  }
  // update subtotal display if present
  const sub = document.getElementById('cart-subtotal');
  if(sub){
    sub.textContent = '€ ' + calculateTotal().toFixed(2);
  }
}

/* Attach add-to-cart buttons on pages */
function attachAddButtons(){
  document.querySelectorAll('.add-to-cart').forEach(btn=>{
    // avoid attaching twice
    if(btn.dataset.attached) return;
    btn.dataset.attached = '1';
    btn.addEventListener('click', function(){
      const item = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image
      };
      addToCart(item);
      // quick feedback
      this.textContent = 'Adicionado';
      setTimeout(()=> this.textContent = 'Adicionar', 900);
    });
  });
}

/* Update cart count badge in navbar(s) */
function updateCartCount(){
  const countEls = [document.getElementById('cart-count'), document.getElementById('cart-count-2')];
  const total = getCart().reduce((s,i)=>s + i.qty, 0);
  countEls.forEach(el=>{
    if(el) el.textContent = total;
  });
}

/* Run on load */
document.addEventListener('DOMContentLoaded', function(){
  attachAddButtons();
  updateCartCount();
  renderCart(); // safe to call even if not on cart page
});

/* cart.js
Minimal vanilla JS to handle cart in localStorage.
Functions:
- addToCart: Adds an item (or increases qty)
- getCart: returns cart array
- saveCart: saves to localStorage
- renderCart: populates cart.html table and updates summary
- calculateGrandTotal: computes all totals (subtotal,shipping, grand total)
- attachAddButtons: attach event listeners to 'Add' buttons
- clearCart: Clears all items from the cart (NEW)
*/

// Constants for calculations
const DISCOUNT_THRESHOLD = 100; // Corrigido para €100 conforme o HTML
const SHIPPING_EXPRESS_COST = 12.99;
const SHIPPING_FREE_COST = 0.00; // Base cost for the 'pickup' option

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

/* Clear all items from the cart */
function clearCart(){
    if (confirm("Are you sure you want to clear your entire cart?")) {
        saveCart([]);
        renderCart();
    }
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
    // CORREÇÃO 1: Renderiza o carrinho se estiver na página "cart.html"
    if (document.getElementById('cart-items')) {
        renderCart(); 
    }
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

/* Calculate subtotal price (Total of items only) */
function calculateSubtotal(){
    const cart = getCart();
    return cart.reduce((s,it)=>s + (it.price * it.qty), 0);
}

/* Calculate all fees and grand total */
function calculateGrandTotal(){
    const subtotal = calculateSubtotal();
    
    // 1. Discount (Fixed at 0 for this minimal example)
    const discount = 0.00; 

    // 2. Shipping
    let shippingCost = 0.00;
    const selectedShippingRadio = document.querySelector('input[name="shipping"]:checked');
    
    // Determine the base cost of the selected shipping option
    if (selectedShippingRadio) {
        shippingCost = parseFloat(selectedShippingRadio.dataset.cost) || 0.00;
    } else {
        // Fallback: Default to Express if none is checked
        shippingCost = SHIPPING_EXPRESS_COST; 
    }

    // CORREÇÃO 2: Aplicar Free Shipping Logic
    let isFreeShippingApplied = false;
    
    // Apenas a opção 'Express Delivery' é elegível para o frete grátis se o subtotal for atingido.
    // 'Pick Up In Store' já é grátis.
    if (subtotal >= DISCOUNT_THRESHOLD && selectedShippingRadio && selectedShippingRadio.id === 'express') {
        shippingCost = 0.00;
        isFreeShippingApplied = true;
    }
    
    // 3. Grand Total (Taxa removida, pois está incluída no preço do produto)
    const grandTotal = subtotal - discount + shippingCost;

    return {
        subtotal,
        discount,
        shippingCost,
        grandTotal,
        isFreeShippingApplied
    };
}

/* Updates the total summary panel (Subtotal, Shipping, Total) */
function updateSummary() {
    const totals = calculateGrandTotal();

    // Update display elements
    const updateEl = (id, value) => {
        const el = document.getElementById(id);
        if(el) el.textContent = `€ ${value.toFixed(2)}`;
    };

    updateEl('cart-subtotal', totals.subtotal);
    updateEl('cart-discount', -totals.discount); // Display as negative
    updateEl('cart-grand-total', totals.grandTotal);
    
    // CORREÇÃO 2.1: Atualiza o custo de envio e a mensagem de frete grátis
    const freeShippingMessage = document.getElementById('free-shipping-message');
    const expressCostSpan = document.getElementById('express-cost');

    if (freeShippingMessage) {
        if (totals.subtotal >= DISCOUNT_THRESHOLD) {
            freeShippingMessage.classList.remove('d-none');
        } else {
            freeShippingMessage.classList.add('d-none');
        }
    }
    
    // Atualiza o custo exibido ao lado do Express Delivery
    if (expressCostSpan) {
        const isExpressSelected = document.getElementById('express')?.checked;
        
        if (isExpressSelected && totals.subtotal >= DISCOUNT_THRESHOLD) {
            expressCostSpan.textContent = "FREE";
            expressCostSpan.classList.add('text-success', 'fw-bold');
        } else {
            // Se não atingiu o limite OU se 'Pick Up' estiver selecionado, exibe o custo normal.
            expressCostSpan.textContent = `€ ${SHIPPING_EXPRESS_COST.toFixed(2)}`;
            expressCostSpan.classList.remove('text-success', 'fw-bold');
        }
    }
}

/* Render cart page table rows AND total summary */
function renderCart(){
    const tbody = document.getElementById('cart-items');
    // Se não estiver na página do carrinho (onde tbody não existe), apenas atualiza o contador.
    if(!tbody) {
        updateCartCount(); 
        return;
    } 

    const cart = getCart();
    
    // 1. RENDER TABLE ROWS
    if(cart.length === 0){
        tbody.innerHTML = '<tr><td colspan="5">Your cart is empty.</td></tr>';
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
                <td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${it.id}">Remove</button></td>
            `;
            tbody.appendChild(tr);
        });
        
        // Add listeners for new inputs/buttons
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

    // 2. RENDER TOTALS SUMMARY
    updateSummary();

    // 3. Add listeners for necessary elements (only once)
    if (!document.body.dataset.listenersAttached) {
        document.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', updateSummary);
        });
        
        // Listener para o botão 'Clear Cart'
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if(clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
        
        document.body.dataset.listenersAttached = 'true';
    }
}


/* Attach add-to-cart buttons on pages */
function attachAddButtons(){
    document.querySelectorAll('.add-to-cart').forEach(btn=>{
        // avoid attaching twice
        if(btn.dataset.attached) return;
        btn.dataset.attached = '1';

        // Salva o texto original do botão para restaurar depois
        // Verifica se o texto original já foi definido para evitar sobrescrever
        if (!btn.dataset.originalText) {
            btn.dataset.originalText = btn.textContent;
        }

        btn.addEventListener('click', function(){
            const item = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image
            };
            addToCart(item);
            
            // quick feedback
            this.textContent = 'Added'; // Traduzido
            setTimeout(()=> this.textContent = this.dataset.originalText, 900); 
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
    // Apenas renderiza a tabela e resumo se o elemento 'cart-items' existir na página
    if (document.getElementById('cart-items')) {
        renderCart(); 
    }
});
// CALCULO PARA ENVIO
const DISCOUNT_THRESHOLD = 100; // Desconto no frete a partir de 100
const SHIPPING_EXPRESS_COST = 12.99;
const SHIPPING_FREE_COST = 0.00; // Usado para frete grátis / pick up

// LÊ E RETORNA OS PRODUTOS SALVOS NO CARRINHO (LocalStorage)
function getCart(){
    try{
        return JSON.parse(localStorage.getItem('cart')) || [];
    }catch(e){
        return [];
    }
}

// SALVA PRODUTOS INSERIDOS NO CARRINHO E ATUALIZA O CONTADOR
function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// APAGAR TODOS OS ITENS DO CARRINHO COM MSG DE ALERTA
function clearCart(){
    // if (confirm("Are you sure you want to clear your entire cart?")) {
    //     saveCart([]);
    //     renderCart();
    // }
    const clearCartModal = new bootstrap.Modal(document.getElementById('clearCartModal'));
    clearCartModal.show();
}

// FUNÇÃO PARA LIMPAR O CARRINHO APÓS CONFIRMAÇÃO
function confirmClearCart(){
    saveCart([]);
    renderCart();
    
    // Fechar o modal
    const clearCartModal = bootstrap.Modal.getInstance(document.getElementById('clearCartModal'));
    clearCartModal.hide();
}

// ADICIONA ITEM AO CARRINHO 
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
    
    // ATUALIZA A TABELA DO CARRINHO SE O USUARIO ESTÁ NA PAGINA DO CARRINHO
    if (document.getElementById('cart-items')) {
        renderCart(); 
    }
}

// REMOÇÃO DE ITENS DO CARRINHO PELO ID
function removeFromCart(id){
    let cart = getCart();
    cart = cart.filter(c=>c.id !== id);
    saveCart(cart);
    renderCart();
}

// ATUALIZAÇÃO DA QUANTIDADE DE UM ITEM NO CARRINHO
function updateQuantity(id, qty){
    let cart = getCart();
    const item = cart.find(c=>c.id===id);
    
    if(item){
        item.qty = qty;
        
        if(item.qty <= 0){
            // REMOVE O ITEM SE FOR 0 OU MENOS
            cart = cart.filter(c=>c.id!==id);
            saveCart(cart);
        } else {
            saveCart(cart);
        }
    }
    renderCart(); 
}

// CALCULA TODOS OS TOTAIS 
function calculateGrandTotal(){
    const cart = getCart();
    
    // CALCULA O SUBTOTAL 
    const subtotal = cart.reduce((s,it)=>s + (it.price * it.qty), 0);
    
    const discount = 0.00; 

    // CALCULA O CUSTO BASE DE ENVIO
    let shippingCost = 0.00;
    const selectedShippingRadio = document.querySelector('input[name="shipping"]:checked');
    
    // OBTEM O CUSTO QUE O USUARIO SELECIONOU
    if (selectedShippingRadio) {
        
        shippingCost = parseFloat(selectedShippingRadio.dataset.cost) || 0.00;
    } else {
        
        shippingCost = SHIPPING_EXPRESS_COST; 
    }

    // LÓGICA DE FRETE GRÁTIS
    let isFreeShippingApplied = false;
    
    if (subtotal >= DISCOUNT_THRESHOLD && selectedShippingRadio && selectedShippingRadio.id === 'express') {
        shippingCost = 0.00;
        isFreeShippingApplied = true;
    }
    
    // CALCULA O VALOR TOTAL DA COMPRA
    const grandTotal = subtotal - discount + shippingCost;

    const result = {
        subtotal,
        discount,
        shippingCost,
        grandTotal,
        isFreeShippingApplied
    };

    // SALVA OS TOTAIS NA PAGINA DE CHECKOUT
    try {
        localStorage.setItem('cartTotals', JSON.stringify(result));
    } catch (e) {
        console.warn('Erro ao salvar totals no localStorage:', e);
    }

    return result;
}

// ATUALIZA OS VALORES NA SEÇÃO DE RESUMO DA COMPRA
function updateSummary() {
    const totals = calculateGrandTotal();

    const updateEl = (id, value) => {
        const el = document.getElementById(id);
        if(el) el.textContent = (id === 'cart-discount' ? `-€ ${value.toFixed(2)}` : `€ ${value.toFixed(2)}`); 
    };

    updateEl('cart-subtotal', totals.subtotal);
    updateEl('cart-discount', totals.discount); 
    updateEl('cart-grand-total', totals.grandTotal);
    
    const freeShippingMessage = document.getElementById('free-shipping-message');
    const expressCostSpan = document.getElementById('express-cost');

    // EXIBE/OCULTA MSG DE FRETE GRATIS
    if (freeShippingMessage) {
        if (totals.isFreeShippingApplied) {
            freeShippingMessage.classList.remove('d-none');
        } else {
            freeShippingMessage.classList.add('d-none');
        }
    }
    
    // ATUALIZA O CUSTO DO FRETE EXPRESSO 
    if (expressCostSpan) {
        const isExpressSelected = document.getElementById('express')?.checked;
        
        if (isExpressSelected && totals.isFreeShippingApplied) {
            expressCostSpan.textContent = "FREE";
            expressCostSpan.classList.add('text-success', 'fw-bold');
        } else {
            expressCostSpan.textContent = `€ ${SHIPPING_EXPRESS_COST.toFixed(2)}`;
            expressCostSpan.classList.remove('text-success', 'fw-bold');
        }
    }
}

function renderCart(){
    const tbody = document.getElementById('cart-items');
    
    // ATUALIZA CONTADOR DE PRODUTOS NO ICONE CARRINHO
    if(!tbody) {
        updateCartCount(); 
        return;
    } 

    const cart = getCart();
    
    // RENDERIZA AS LINHAS DA TABELA
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
                <td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${it.id}"><i class="bi bi-x-lg"></i></button></td>
            `;
            tbody.appendChild(tr);
        });
        
        // ANEXA AS OPCOES DE QUANTIDADE E REMOVER
        document.querySelectorAll('.qty-input').forEach(inp=>{
            inp.addEventListener('change', e=>{
                const id = e.target.dataset.id;
                const qty = parseInt(e.target.value) || 0;
                updateQuantity(id, qty);
            });
        });
        document.querySelectorAll('.remove-btn').forEach(b=>{
            b.addEventListener('click', e=>{
                const btn = e.currentTarget;
                removeFromCart(btn.dataset.id);
            });
        });
    }

    // RENDERIZA O RESUMO DOS TOTAIS
    updateSummary();
}

// ANEXA BOTÕES 'ADD TO CART' À PÁGINA DE CATÁLOGO 
function attachAddButtons(){
    document.querySelectorAll('.add-to-cart').forEach(btn=>{
        
        if(btn.dataset.attached) return;
        btn.dataset.attached = '1';

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
            
            // BOTAO QUE CONFIRMA QUE O PRODUTO FOI ADICIONADO
            this.textContent = 'Added';
            setTimeout(()=> this.textContent = this.dataset.originalText, 900); 
        });
    });
}

// ATUALIZA O NÚMERO (BADGE) DO CARRINHO NA NAVBAR 
function updateCartCount(){
    
    const countEls = [document.getElementById('cart-count'), document.getElementById('cart-count-2')];
    const total = getCart().reduce((s,i)=>s + i.qty, 0);
    countEls.forEach(el=>{
        if(el) el.textContent = total;
    });
}


// PARA TORNAR BOTOES DA PAG CATALOGO FUNCIONAIS
document.addEventListener('DOMContentLoaded', function(){
    attachAddButtons(); 
    updateCartCount(); 
    
    // INICIALIZAÇÃO ESPECÍFICA DA PÁGINA DO CARRINHO
    if (document.getElementById('cart-items')) {
        renderCart(); 
        
       // ADICIONA BOTOES DE OPCAO DE ENVIO/LEVANTAR
        document.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', updateSummary);
        });
        
        // ADICIONA BOTAO DE LIMPAR CARRINHO
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if(clearCartBtn) clearCartBtn.addEventListener('click', clearCart);


        // CONFIGURAR BOTÃO DE CONFIRMAÇÃO NO MODAL
        const confirmClearBtn = document.getElementById('confirm-clear-cart');
        if(confirmClearBtn) {
            confirmClearBtn.addEventListener('click', confirmClearCart);
        }
    }
});
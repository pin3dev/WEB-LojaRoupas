/**
 * @fileoverview Script para renderizar o resumo do pedido na página de checkout.
 */
function renderOrderSummary() {
  const container = document.getElementById('order-summary'); // Container do resumo do pedido
  if (!container) return;

  const cart = getCart(); // Função que obtém o carrinho do localStorage
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  let totals;
  try {
    totals = JSON.parse(localStorage.getItem('cartTotals') || 'null'); // Tentar obter os totais salvos no localStorage
  } catch (e) {
    totals = null;
  }

  // Fallback: se não houver totais salvos, calcular novamente
  if (!totals) {
    totals = {
      subtotal: cart.reduce((s, it) => s + (it.price * it.qty), 0),
      discount: 0,
      shippingCost: 0,
      grandTotal: 0,
      isFreeShippingApplied: false
    };
    totals.grandTotal = totals.subtotal - totals.discount + totals.shippingCost;
  }

  // Criar HTML
  let html = '<ul class="list-unstyled">';
  cart.forEach(item => {
    html += `
      <li class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
          <div>
            <div class="small fw-semibold">${item.name}</div>
            <div class="text-muted small">${item.qty} × €${item.price.toFixed(2)}</div>
          </div>
        </div>
        <div class="fw-semibold">€ ${(item.price * item.qty).toFixed(2)}</div>
      </li>
    `;
  });
  html += '</ul><hr>';

  // Totais do pedido a partir dos dados calculados
  html += `
    <div class="d-flex justify-content-between mb-1">
      <span>Subtotal</span><span>€ ${totals.subtotal.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between mb-1">
      <span>Shipping</span><span>€ ${totals.shippingCost.toFixed(2)}</span>
    </div>
    <hr>
    <div class="d-flex justify-content-between fw-bold">
      <span>Total (tax included)</span><span>€ ${totals.grandTotal.toFixed(2)}</span>
    </div>
  `;

  container.innerHTML = html;
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', renderOrderSummary);
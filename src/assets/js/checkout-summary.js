function renderOrderSummary() {
  const container = document.getElementById('order-summary');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  // Calcular totais
  const totals = calculateGrandTotal();

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

  // Totais
  html += `
    <div class="d-flex justify-content-between mb-1">
      <span>Subtotal</span><span>€ ${totals.subtotal.toFixed(2)}</span>
    </div>
    <div class="d-flex justify-content-between mb-1">
      <span>Envio</span><span>€ ${totals.shippingCost.toFixed(2)}</span>
    </div>
    <hr>
    <div class="d-flex justify-content-between fw-bold">
      <span>Total</span><span>€ ${totals.grandTotal.toFixed(2)}</span>
    </div>
  `;

  container.innerHTML = html;
}

// Executar quando a página carregar
document.addEventListener('DOMContentLoaded', renderOrderSummary);

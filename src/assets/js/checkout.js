
function goToStep(stepIndex) {
  const steps = document.querySelectorAll(".checkout-steps .step");
  const forms = document.querySelectorAll(".checkout-step");

  // 🔹 Antes de mudar de etapa, salva os dados da atual
  if (stepIndex > 0) saveStepData(stepIndex - 1);

  // 🔹 Atualiza a barra de progresso
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < stepIndex) step.classList.add("completed");
    if (i === stepIndex) step.classList.add("active");
  });

  // 🔹 Mostra a etapa correspondente
  forms.forEach((form, i) => {
    form.classList.toggle("d-none", i !== stepIndex);
  });

  // 🔹 Se for a etapa de Review, preenche o resumo
  if (stepIndex === 3) fillReviewStep();
}


// Armazena todos os dados do checkout
let checkoutData = {
  information: {},
  shipping: {},
  payment: {}
};

// Função para salvar os dados atuais de uma etapa
function saveStepData(stepIndex) {
  if (stepIndex === 0) { // Etapa 1: Information
    checkoutData.information = {
      name: document.querySelector('#step-1 input[type="text"]').value,
      email: document.querySelector('#step-1 input[type="email"]').value,
      phone: document.querySelector('#step-1 input[type="tel"]').value,
    };
  }

  if (stepIndex === 1) { // Etapa 2: Shipping
    const inputs = document.querySelectorAll('#step-2 input');
    checkoutData.shipping = {
      street: inputs[0].value,
      apt: inputs[1].value,
      city: inputs[2].value,
      state: inputs[3].value,
      zip: inputs[4].value,
      country: inputs[5].value,
    };
  }

  if (stepIndex === 2) { // Etapa 3: Payment
    const inputs = document.querySelectorAll('#step-3 input');
    checkoutData.payment = {
      cardNumber: inputs[0].value,
      expiry: inputs[1].value,
      cvv: inputs[2].value,
      cardName: inputs[3].value,
    };
  }
}


function fillReviewStep() {
  const reviewContainer = document.querySelector('#step-4');
  if (!reviewContainer) return;

  const { information, shipping, payment } = checkoutData;

  const maskedCard = payment.cardNumber
    ? "**** **** **** " + payment.cardNumber.slice(-4)
    : "—";

  const html = `
    <h6>Review Your Order</h6>
    <p>Check your details before confirming:</p>

    <div class="mb-3">
      <h6 class="fw-semibold">Customer Information</h6>
      <p class="small mb-1"><strong>Name:</strong> ${information.name || "—"}</p>
      <p class="small mb-1"><strong>Email:</strong> ${information.email || "—"}</p>
      <p class="small mb-1"><strong>Phone:</strong> ${information.phone || "—"}</p>
    </div>

    <div class="mb-3">
      <h6 class="fw-semibold">Shipping Address</h6>
      <p class="small mb-1">${shipping.street || ""} ${shipping.apt || ""}</p>
      <p class="small mb-1">${shipping.city || ""}, ${shipping.state || ""} ${shipping.zip || ""}</p>
      <p class="small mb-1">${shipping.country || ""}</p>
    </div>

    <div class="mb-3">
      <h6 class="fw-semibold">Payment</h6>
      <p class="small mb-1"><strong>Cardholder:</strong> ${payment.cardName || "—"}</p>
      <p class="small mb-1"><strong>Card:</strong> ${maskedCard}</p>
      <p class="small mb-1"><strong>Expiry:</strong> ${payment.expiry || "—"}</p>
    </div>

    <div class="d-flex justify-content-between mt-3">
      <button class="btn btn-outline-secondary" onclick="goToStep(2)">Back to Payment</button>
      <button class="btn btn-success" onclick="finalizeOrder()">Place Order</button>
    </div>
  `;

  reviewContainer.innerHTML = html;
}

function finalizeOrder() {
  localStorage.removeItem('cart');
  alert("Pedido finalizado com sucesso! Obrigado pela compra.");
  window.location.href = "index.html";
}

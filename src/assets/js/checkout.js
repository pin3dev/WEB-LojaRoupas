function goToStep(stepIndex) {
  const steps = document.querySelectorAll(".checkout-steps .step");
  const forms = document.querySelectorAll(".checkout-step");

  // 🔹 Identifica a etapa atual (a que está visível no momento)
  const currentStepIndex = Array.from(forms).findIndex(f => !f.classList.contains("d-none"));
  const currentForm = forms[currentStepIndex];

  // 🔹 Se o usuário está tentando avançar, validar os campos obrigatórios
  if (stepIndex > currentStepIndex) {
    const requiredInputs = currentForm.querySelectorAll("input[required], select[required], textarea[required]");
    let isValid = true;

    requiredInputs.forEach(input => {
      if (!input.checkValidity()) {
        input.classList.add("is-invalid");
        isValid = false;
      } else {
        input.classList.remove("is-invalid");
      }
    });

    if (!isValid) {
      currentForm.reportValidity(); // Exibe mensagem padrão do navegador
      return; // 🔒 Impede o avanço
    }

    // 🔹 Se for válido, salva os dados da etapa atual
    saveStepData(currentStepIndex);
  }

  // 🔹 Atualiza barra de progresso
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < stepIndex) step.classList.add("completed");
    if (i === stepIndex) step.classList.add("active");
  });

  // 🔹 Mostra a etapa correspondente e esconde as outras
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
      <button class="btn btn-success" onclick="showOrderModal()">Place Order</button>
    </div>
  `;

  
  reviewContainer.innerHTML = html;
}

function showOrderModal() {
  const orderModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
  orderModal.show();
  finalizeOrder();
}

function finalizeOrder() {
  // remove cart and show success UI
  localStorage.removeItem('cart');
  // showSuccessFlag('Pedido finalizado com sucesso! Obrigado pela compra.');
  // wait a moment so user sees the message, then redirect
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1700);
}

// Shows the floating success flag with a message, auto-hides after a timeout
// function showSuccessFlag(message, timeout = 1500) {
//   let el = document.getElementById('success-flag');
//   if (!el) return;
//   const content = el.querySelector('.success-flag__content');
//   if (content) content.textContent = message;
//   el.classList.add('show');
//   // remove after timeout
//   clearTimeout(el._hideTimer);
//   el._hideTimer = setTimeout(() => {
//     el.classList.remove('show');
//   }, timeout);
// }




document.addEventListener('DOMContentLoaded', () => {
  const continueBtn = document.querySelector('#step-1 button.btn-primary'); // botão da etapa 1
  const warning = document.getElementById('empty-cart-warning');

  function checkCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      continueBtn.disabled = true;
      continueBtn.classList.remove('btn-primary');
      continueBtn.classList.add('btn-secondary', 'disabled');
      continueBtn.textContent = 'Cart is empty';
      continueBtn.style.cursor = 'not-allowed';

      if (warning) warning.classList.remove('d-none');
    } else {
      continueBtn.disabled = false;
      continueBtn.classList.add('btn-primary');
      continueBtn.classList.remove('btn-secondary', 'disabled');
      continueBtn.textContent = 'Continue to Shipping';
      continueBtn.style.cursor = 'pointer';

      if (warning) warning.classList.add('d-none');
    }
  }

  checkCart();
  window.addEventListener('storage', checkCart);
});







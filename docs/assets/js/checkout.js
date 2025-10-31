/**
 * @param {*} stepIndex - Índice da etapa para a qual navegar (0-based).
 * @description Navega para a etapa especificada do checkout, validando os campos obrigatórios da etapa atual antes de avançar.
 */
function goToStep(stepIndex) {
  const steps = document.querySelectorAll(".checkout-steps .step");
  const forms = document.querySelectorAll(".checkout-step");

  // Identifica a etapa atual, visivel no momento
  const currentStepIndex = Array.from(forms).findIndex(f => !f.classList.contains("d-none"));
  const currentForm = forms[currentStepIndex];

  // Se o user tenta avançar, valida os campos obrigatórios
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
      // console.warn("🚫 Campo inválido! Travando avanço...");
      requiredInputs.forEach(input => {
        if (!input.checkValidity()) console.log("❌ Inválido:", input);
      });
      if (requiredInputs[0]) {
        currentForm.reportValidity(); // Exibe mensagem no navegador
      }
      return; // Impede o avanço
    }
    // Se for válido, salva os dados da etapa atual
    saveStepData(currentStepIndex);
  }
  // Atualiza barra de progresso
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < stepIndex) step.classList.add("completed");
    if (i === stepIndex) step.classList.add("active");
  });
  // Mostra a etapa correspondente e esconde as outras
  forms.forEach((form, i) => {
    form.classList.toggle("d-none", i !== stepIndex);
  });
  // Se for a etapa de Review, preenche o resumo
  if (stepIndex === 3) fillReviewStep();
}



/**
 * @description Objeto para armazenar os dados coletados em cada etapa do checkout.
 */
let checkoutData = {
  information: {},
  shipping: {},
  payment: {}
};



/**
 * @param {*} stepIndex 
 * @description Salva os dados inseridos na etapa especificada do checkout no objeto checkoutData.
 */
function saveStepData(stepIndex) {
  if (stepIndex === 0) { // Etapa 1: Information
    checkoutData.information = {
      name: document.getElementById('full-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
    };
  }

  if (stepIndex === 1) { // Etapa 2: Shipping
    const inputs = document.querySelectorAll('#step-2 input');
    checkoutData.shipping = {
      street: document.getElementById('address')?.value || '',
      apt: document.getElementById('apt')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      zip: document.getElementById('zip')?.value || '',
      country: document.getElementById('conutry')?.value || '',
    };
  }

  if (stepIndex === 2) { // Etapa 3: Payment
    const inputs = document.querySelectorAll('#step-3 input');
    checkoutData.payment = {
      cardNumber: document.getElementById('cardnumb')?.value || '',
      expiry: document.getElementById('expiry')?.value || '',
      cvv: document.getElementById('cvv')?.value || '',
      cardName: document.getElementById('cardname')?.value || '',
    };
  }
}


/**
 * @description Preenche a etapa de revisão com os dados coletados nas etapas anteriores.
 */
function fillReviewStep() {
  const reviewContainer = document.querySelector('#step-4');
  if (!reviewContainer) return;

  const {
    information,
    shipping,
    payment
  } = checkoutData;

  const maskedCard = payment.cardNumber ?
    "**** **** **** " + payment.cardNumber.slice(-4) :
    "—";

  // Monta o HTML de revisão de dados, usando os dados coletados
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



/**
 * @description Exibe o modal de confirmação do pedido e finaliza o pedido.
 */
function showOrderModal() {
  const orderModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
  orderModal.show();
  finalizeOrder();
}

/**
 * @description Finaliza o pedido, limpando o carrinho e redirecionando o usuário.
 */
function finalizeOrder() {
  localStorage.removeItem('cart');
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1700);
}


/**
 * @description Verifica o carrinho e atualiza o botão "Continue to Shipping" na etapa 1 do checkout.
 */
document.addEventListener('DOMContentLoaded', () => {
  const continueBtn = document.querySelector('#step-1 button.btn-primary'); // botão da etapa 1
  const warning = document.getElementById('empty-cart-warning'); // aviso de carrinho vazio

  
  /**
   * @description Verifica o conteúdo do carrinho e atualiza o estado do botão de continuação e o aviso de carrinho vazio.
   */
  function checkCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
      continueBtn.disabled = true;
      continueBtn.classList.remove('btn-primary');
      continueBtn.classList.add('btn-secondary', 'disabled');
      continueBtn.textContent = 'Cart is empty'; // botão desativado
      continueBtn.style.cursor = 'not-allowed';

      if (warning) warning.classList.remove('d-none');
    } else {
      continueBtn.disabled = false;
      continueBtn.classList.add('btn-primary');
      continueBtn.classList.remove('btn-secondary', 'disabled');
      continueBtn.textContent = 'Continue to Shipping'; // botão ativado
      continueBtn.style.cursor = 'pointer';

      if (warning) warning.classList.add('d-none');
    }
  }

  checkCart(); // Verifica qual botão mostrar ao carregar a página
  window.addEventListener('storage', checkCart); // Atualiza se o carrinho mudar em outra aba

  // Validação em tempo real dos campos obrigatórios
  document.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.toggle('is-invalid', !input.checkValidity());
    });
  });

});
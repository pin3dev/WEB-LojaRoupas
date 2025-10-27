function goToStep(stepIndex) {
  const steps = document.querySelectorAll(".checkout-steps .step");
  const forms = document.querySelectorAll(".checkout-step");

  // Atualiza os círculos
  steps.forEach((step, i) => {
    step.classList.remove("active", "completed");
    if (i < stepIndex) step.classList.add("completed");
    if (i === stepIndex) step.classList.add("active");
  });

  // Mostra/esconde formulários
  forms.forEach((form, i) => {
    form.classList.toggle("d-none", i !== stepIndex);
  });
}


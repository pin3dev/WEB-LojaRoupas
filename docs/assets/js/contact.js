/**
 * @fileoverview JavaScript para o formulário de contato com validação e modal de confirmação.
 */
document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contact-form'); // formulário de contato
  if (contactForm) { // verifica se o formulário existe
    contactForm.addEventListener('submit', function (e) { // ao enviar o formulário
      e.preventDefault(); 

      let valid = true;
      const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]'); // campos obrigatórios
      requiredFields.forEach(input => {
        if (!input.value.trim()) { // se o campo estiver vazio
          input.classList.add('is-invalid'); 
          valid = false;
        } else {
          input.classList.remove('is-invalid'); // remove a classe de erro
        }
      });

      if (!valid) return; // impede envio se houver campo vazio

      const modalElement = document.getElementById('confirmationModal'); // modal de confirmação
      if (modalElement) {
        const confirmationModal = new bootstrap.Modal(modalElement); // inicializa o modal
        confirmationModal.show();
        contactForm.reset();
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', function() {
  // Atualizar o ano no rodapé
//   const yearElement = document.getElementById('year5');
//   if (yearElement) {
//     yearElement.textContent = new Date().getFullYear();
//   }

  // Handler do formulário de contato
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Verificar se o modal existe
      // const modalElement = document.getElementById('confirmationModal');
      // if (modalElement) {
      //   const confirmationModal = new bootstrap.Modal(modalElement);
      //   confirmationModal.show();
        
      //   // Reset do formulário
      //   this.reset();
      // } 
    //   else {
    //     console.error('Modal não encontrado');
    //     alert('Mensagem enviada com sucesso!'); // Fallback
    //   }


      let valid = true;
      const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
      requiredFields.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          valid = false;
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (!valid) return; // impede envio se houver campo vazio

      const modalElement = document.getElementById('confirmationModal');
      if (modalElement) {
        const confirmationModal = new bootstrap.Modal(modalElement);
        confirmationModal.show();
        contactForm.reset();
      }
    });
  }
});
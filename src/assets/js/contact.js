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
      const modalElement = document.getElementById('confirmationModal');
      if (modalElement) {
        const confirmationModal = new bootstrap.Modal(modalElement);
        confirmationModal.show();
        
        // Reset do formulário
        this.reset();
      } 
    //   else {
    //     console.error('Modal não encontrado');
    //     alert('Mensagem enviada com sucesso!'); // Fallback
    //   }
    });
  }
});
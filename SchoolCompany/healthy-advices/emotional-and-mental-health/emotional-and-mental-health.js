document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.read-more-btn').forEach(button => {
      button.addEventListener('click', function () {
        const currentCard = this.closest('.mental-card');
        if (!currentCard) return;
  
        const fullText = currentCard.querySelector('.full-text');
        const dots = currentCard.querySelector('.dots');
        const isOpen = this.classList.contains('open');
  
        // Затваряне на всички други карти
        document.querySelectorAll('.mental-card').forEach(card => {
          if (card !== currentCard) {
            const otherFullText = card.querySelector('.full-text');
            const otherDots = card.querySelector('.dots');
            const otherBtn = card.querySelector('.read-more-btn');
  
            if (otherFullText && otherDots && otherBtn) {
              otherFullText.style.opacity = '0';
              setTimeout(() => {
                otherFullText.style.display = 'none';
                otherDots.style.display = 'inline';
              }, 300);
              otherBtn.textContent = 'Научи повече';
              otherBtn.classList.remove('open');
              card.classList.remove('open');
            }
          }
        });
  
        // Превключване на текущата карта
        if (isOpen) {
          fullText.style.opacity = '0';
          setTimeout(() => {
            fullText.style.display = 'none';
            dots.style.display = 'inline';
          }, 300);
          this.textContent = 'Научи повече';
          this.classList.remove('open');
          currentCard.classList.remove('open');
        } else {
          fullText.style.display = 'inline';
          setTimeout(() => {
            fullText.style.opacity = '1';
          }, 10);
          dots.style.display = 'none';
          this.textContent = 'Покажи по-малко';
          this.classList.add('open');
          currentCard.classList.add('open');
        }
      });
    });
  });
  
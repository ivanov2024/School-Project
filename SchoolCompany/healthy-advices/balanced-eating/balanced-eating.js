document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.nutrition-card');

    cards.forEach(card => {
        const expandBtn = card.querySelector('.expand-toggle');
        const collapseBtn = card.querySelector('.collapse-toggle');

        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                card.classList.add('expanded');
            });
        }

        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                card.classList.remove('expanded');
            });
        }
    });
});

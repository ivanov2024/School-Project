// Минимална работеща версия с дебъг
function initMenu() {
    console.log('Initializing menu...');
    
    const burgerIcon = document.getElementById('burger-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!burgerIcon || !mobileMenu) {
        console.error('Critical elements missing!');
        return;
    }
    
    console.log('Elements found:', {burgerIcon, mobileMenu});
    
    burgerIcon.addEventListener('click', function() {
        console.log('Burger icon clicked!');
        this.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
}

// Два начина за инициализация:
document.addEventListener('DOMContentLoaded', initMenu);
// ИЛИ просто извикваме функцията директно
initMenu();
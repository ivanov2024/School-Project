function loadFooter() {
    fetch('../main-code/footer.html')
        .then(response => response.text())
        .then(html => {
        document.getElementById('footer-placeholder').innerHTML = html;
        })
        .catch(error => console.error('Error loading navigation:', error));
}
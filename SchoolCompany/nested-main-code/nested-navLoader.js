function loadNavBar() {
    fetch('../../nested-main-code/netsed-nav.html')
        .then(response => response.text())
        .then(html => {
        document.getElementById('nav-placeholder').innerHTML = html;
        })
        .catch(error => console.error('Error loading navigation:', error));
}
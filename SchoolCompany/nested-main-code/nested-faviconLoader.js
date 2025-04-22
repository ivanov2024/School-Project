document.addEventListener("DOMContentLoaded", function () {
    let favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = "../../../images/logo.jfif"; 

    document.head.appendChild(favicon);
});

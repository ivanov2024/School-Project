document.addEventListener("DOMContentLoaded", function () {
    let favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = "../../pictures/logo-example.jpg"; 

    document.head.appendChild(favicon);
});

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const weightUnit = document.getElementById('weight-unit').value;
    const heightUnit = document.getElementById('height-unit').value;

    const result = document.getElementById("bmi-result");

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        result.textContent = "Моля, въведете валидни стойности.";
        result.style.color = "#d32f2f";
        return;
    }

    let bmi;

    if (weightUnit === 'kg' && heightUnit === 'cm') {
        bmi = weight / ((height / 100) ** 2);
    } else if (weightUnit === 'lb' && heightUnit === 'in') {
        bmi = (weight / (height ** 2)) * 703;
    } else if (weightUnit === 'kg' && heightUnit === 'in') {
        const heightInCm = height * 2.54;
        bmi = weight / ((heightInCm / 100) ** 2);
    } else if (weightUnit === 'lb' && heightUnit === 'cm') {
        const weightInKg = weight * 0.453592;
        bmi = weightInKg / ((height / 100) ** 2);
    }

    bmi = bmi.toFixed(1);

    let category = '';
    let color = '';
    let heading = '';
    let text = '';
    let showCard = false;

    if (bmi < 18.5) {
        category = "Поднормено тегло";
        color = "#f57c00";
        heading = "Как да качите килограми здравословно?";
        text = "Ако вашият ИТМ е под нормата, фокусирайте се върху хранителни вещества, балансирана диета и умерена физическа активност. За повече информация:";
        showCard = true;
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Нормално тегло";
        color = "#388e3c";
    } else if (bmi >= 25 && bmi < 30) {
        category = "Наднормено тегло";
        color = "#fbc02d";
        heading = "Как да свалите килограми бързо и лесно?";
        text = "Намалете приема на захари и мазнини, увеличете физическата активност и се консултирайте със специалист. За повече информация:";
        showCard = true;
    } else {
        category = "Затлъстяване";
        color = "#d32f2f";
        heading = "Как да свалите килограми бързо и лесно?";
        text = "Създайте устойчив план с балансирано хранене и редовно движение. Избягвайте крайни диети. За повече информация:";
        showCard = true;
    }

    result.innerText = `Вашият ИТМ е ${bmi} - ${category}`;
    result.style.color = color;

    document.getElementById("bmi-heading").innerText = heading;
    document.getElementById("bmi-text").innerText = text;

    const cardContainer = document.getElementById("bmi-card");
    cardContainer.innerHTML = "";

    if (showCard) {
        const card = document.createElement("a");
        card.href = "../../healthy-advices/balanced-eating/balanced-eating.html";
        card.className = "card";
        card.innerHTML = "<h1>Към Балансирано хранене</h1>";
        cardContainer.appendChild(card);
    } else {
        document.getElementById("bmi-heading").innerText = "";
        document.getElementById("bmi-text").innerText = "";
    }
}

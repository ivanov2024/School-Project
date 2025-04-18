function calculateCalories() {
    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("calorie-weight").value);
    const height = parseFloat(document.getElementById("calorie-height").value);
    const age = parseInt(document.getElementById("calorie-age").value);
    const activity = parseFloat(document.getElementById("activity").value);
    const result = document.getElementById("calorie-result");

    if (isNaN(weight) || isNaN(height) || isNaN(age)) {
        result.textContent = "Моля, попълнете всички полета с валидни стойности.";
        return;
    }

    let bmr;

    if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const totalCalories = Math.round(bmr * activity);

    result.textContent = `Вашите приблизителни дневни нужди от калории са ${totalCalories} kcal.`;
}
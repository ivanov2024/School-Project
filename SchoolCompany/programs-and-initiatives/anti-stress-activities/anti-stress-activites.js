// Елементите
const calendar = document.getElementById("calendar");
const emojiModal = document.getElementById("emojiModal");
const emojiButtons = document.querySelectorAll(".emoji-options button");
const emojiClose = document.querySelector(".emoji-close");
const datePicker = document.getElementById("date-picker");

const textModal = document.getElementById("textModal");
const textClose = document.querySelector(".text-close");
const saveNoteBtn = document.getElementById("save-note");
const noteTextarea = document.getElementById("day-note");

let currentDate = new Date();
let selectedDayElement = null;

// Emoji стилове
const emojiMoods = {
  "😊": "mood-happy",
  "😢": "mood-sad",
  "😡": "mood-angry",
  "😐": "mood-neutral"
};

// Безопасно JSON парсване
function safeParse(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.warn(`⚠️ Проблем с localStorage[${key}]:`, e.message);
    localStorage.removeItem(key);
    return {};
  }
}

// Рендиране на календара – само текущия месец
function renderCalendar(date) {
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emojiData = safeParse("emojiCalendar");
  const notes = safeParse("dayNotes");
  const monthKey = `${year}-${month + 1}`;

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement("div");
    day.className = "calendar-day";
    day.textContent = i;
  
    const dayId = `${monthKey}-day-${i}`;
    day.setAttribute("data-date", dayId);
  
    // Изчистване на остатъци
    day.innerHTML = i;
  
    // 🎯 Емоджи
    if (emojiData[dayId]) {
      const { emoji, color } = emojiData[dayId];
      day.style.backgroundColor = color;
  
      const emojiSpan = document.createElement("span");
      emojiSpan.className = "emoji-indicator";
      emojiSpan.innerText = emoji;
      day.appendChild(emojiSpan);
    }
  
    // 📝 Бележка
    if (notes[dayId]) {
      day.classList.add("has-note");
  
      const noteIcon = document.createElement("span");
      noteIcon.className = "note-indicator";
      noteIcon.textContent = "📝";
      day.appendChild(noteIcon);
  
      const noteText = document.createElement("div");
      noteText.className = "note-preview";
      noteText.textContent = notes[dayId];
      day.appendChild(noteText);
    }
  
    // 👉 Клик за отваряне на текстовия модал
    day.addEventListener("click", () => {
        console.log("Кликнат ден:", dayId);
      selectedDayElement = day;
      noteTextarea.value = notes[dayId] || "";
      openTextModal();
    });
  
    calendar.appendChild(day);
  }
  
}

// 👉 Отваряне на текстовия модал
function openTextModal() {
  textModal.style.display = "block";
}

// 👉 Затваряне на текстовия модал
function closeTextModal() {
  textModal.style.display = "none";
}

// 👉 Отваряне на emoji модала
function openEmojiModal() {
  emojiModal.style.display = "block";
}

// 👉 Затваряне на emoji модала
function closeEmojiModal() {
  emojiModal.style.display = "none";
}

// Избор на дата от input
datePicker.addEventListener("change", () => {
  const selectedDate = new Date(datePicker.value);
  if (isNaN(selectedDate)) return;

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();

  currentDate = new Date(year, month, 1);
  renderCalendar(currentDate);

  setTimeout(() => {
    const dayId = `${year}-${month + 1}-day-${day}`;
    const calendarDay = document.querySelector(`[data-date="${dayId}"]`);

    if (calendarDay) {
      calendarDay.classList.remove("inactive-day");
      selectedDayElement = calendarDay;

      calendarDay.scrollIntoView({ behavior: "smooth", block: "center" });
      calendarDay.classList.add("selected-date-glow");

      setTimeout(() => {
        calendarDay.classList.remove("selected-date-glow");
      }, 2000);

      calendarDay.click(); // Автоматично отваря бележката
    }
  }, 100);
});

// Запазване на бележка и преминаване към emoji
saveNoteBtn.addEventListener("click", () => {
  if (!selectedDayElement) return;

  const dayId = selectedDayElement.getAttribute("data-date");
  const note = noteTextarea.value.trim();
  const notes = safeParse("dayNotes");

  // Обновяване или премахване на бележката
  if (note) {
    notes[dayId] = note;
    selectedDayElement.classList.add("has-note");

    const noteIcon = document.createElement("span");
    noteIcon.className = "note-indicator";
    noteIcon.textContent = "📝";
    selectedDayElement.appendChild(noteIcon);

    const noteText = document.createElement("div");
    noteText.className = "note-preview";
    noteText.textContent = note;
    selectedDayElement.appendChild(noteText);
  } else {
    delete notes[dayId];
    selectedDayElement.classList.remove("has-note");
  }

  localStorage.setItem("dayNotes", JSON.stringify(notes));

  closeTextModal();
  openEmojiModal();
});

// Emoji логика
emojiButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!selectedDayElement) return;

    const emoji = button.getAttribute("data-emoji");
    const bgColor = button.getAttribute("data-color");
    const dayId = selectedDayElement.getAttribute("data-date");

    selectedDayElement.style.backgroundColor = bgColor || "";

    let existingEmoji = selectedDayElement.querySelector(".emoji-indicator");
    if (existingEmoji) existingEmoji.remove();

    if (emoji) {
      const emojiSpan = document.createElement("span");
      emojiSpan.className = "emoji-indicator";
      emojiSpan.innerText = emoji;
      selectedDayElement.appendChild(emojiSpan);
    }

    const emojiData = safeParse("emojiCalendar");
    if (emoji) {
      emojiData[dayId] = { emoji, color: bgColor };
    } else {
      delete emojiData[dayId];
    }
    localStorage.setItem("emojiCalendar", JSON.stringify(emojiData));

    closeEmojiModal();
  });
});

// Затваряне на модалите
emojiClose.onclick = closeEmojiModal;
textClose.onclick = closeTextModal;

window.onclick = e => {
  if (e.target === emojiModal) closeEmojiModal();
  if (e.target === textModal) closeTextModal();
};

// Зареждане при отваряне
window.addEventListener("DOMContentLoaded", () => {
  renderCalendar(currentDate);
});

// Календар бутон
document.getElementById("calendar-button").addEventListener("click", () => {
  datePicker.showPicker();
});

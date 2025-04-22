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

    // 🧹 Ако потребителят е избрал "Изчисти"
    if (emoji === "") {
      // 1. Премахване от localStorage
      const notes = safeParse("dayNotes");
      const emojiData = safeParse("emojiCalendar");

      delete notes[dayId];
      delete emojiData[dayId];

      localStorage.setItem("dayNotes", JSON.stringify(notes));
      localStorage.setItem("emojiCalendar", JSON.stringify(emojiData));

      // 2. Почистване на визуалните индикатори
      selectedDayElement.classList.remove("has-note");
      selectedDayElement.style.backgroundColor = "";

      const noteIcon = selectedDayElement.querySelector(".note-indicator");
      if (noteIcon) noteIcon.remove();

      const notePreview = selectedDayElement.querySelector(".note-preview");
      if (notePreview) notePreview.remove();

      const emojiIndicator = selectedDayElement.querySelector(".emoji-indicator");
      if (emojiIndicator) emojiIndicator.remove();

      noteTextarea.value = "";

      closeEmojiModal();
      return; // 🛑 Спиране на останалия код
    }

    // 🎯 Ако е избрано нормално емоджи:
    selectedDayElement.style.backgroundColor = bgColor || "";

    let existingEmoji = selectedDayElement.querySelector(".emoji-indicator");
    if (existingEmoji) existingEmoji.remove();

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "emoji-indicator";
    emojiSpan.innerText = emoji;
    selectedDayElement.appendChild(emojiSpan);

    const emojiData = safeParse("emojiCalendar");
    emojiData[dayId] = { emoji, color: bgColor };
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

const breatheCircle = document.getElementById("breathe-circle");

const phases = [
  { text: "Вдишай", duration: 4000, scale: 1.3, color: "#d4edda" },
  { text: "Задръж", duration: 4000, scale: 1.3, color: "#ffeeba" },
  { text: "Издишай", duration: 4000, scale: 1.0, color: "#f8d7da" }
];

let phaseIndex = 0;

function runBreathingCycle() {
  const currentPhase = phases[phaseIndex];
  
  breatheCircle.innerText = currentPhase.text;
  breatheCircle.style.transform = `scale(${currentPhase.scale})`;
  breatheCircle.style.backgroundColor = currentPhase.color;

  setTimeout(() => {
    phaseIndex = (phaseIndex + 1) % phases.length;
    runBreathingCycle();
  }, currentPhase.duration);
}

runBreathingCycle();


const questions = [
  {
    question: "Как обикновено се справяш със стреса?",
    options: [
      { text: "Разходка навън", type: "Природолюбител" },
      { text: "Медитация и йога", type: "Спокоен ум" },
      { text: "Говоря с приятели", type: "Социален оптимист" },
      { text: "Гледам филм или играя игри", type: "Креативен беглец" }
    ]
  },
  {
    question: "Кой е твоят идеален начин за релакс?",
    options: [
      { text: "Слушане на спокойна музика", type: "Спокоен ум" },
      { text: "Пътуване сред природата", type: "Природолюбител" },
      { text: "Срещи с приятели", type: "Социален оптимист" },
      { text: "Четене на книга", type: "Креативен беглец" }
    ]
  },
  {
    question: "Кое от изброените ти носи най-много спокойствие?",
    options: [
      { text: "Тишината", type: "Спокоен ум" },
      { text: "Звукът на птици и дървета", type: "Природолюбител" },
      { text: "Смехът на приятели", type: "Социален оптимист" },
      { text: "Потапяне в измислен свят", type: "Креативен беглец" }
    ]
  }
];

let currentQuestionIndex = 0;
let selectedAnswers = [];

const startBtn = document.getElementById("start-quiz");
const quizContainer = document.getElementById("quiz-container");
const quizStart = document.getElementById("quiz-start");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizError = document.getElementById("quiz-error");
const prevBtn = document.getElementById("prev-question");
const nextBtn = document.getElementById("next-question");
const quizResult = document.getElementById("quiz-result");
const quizScore = document.getElementById("quiz-score");
const quizMessage = document.getElementById("quiz-message");
const restartBtn = document.getElementById("restartQuiz");

startBtn.addEventListener("click", () => {
  quizStart.style.display = "none";
  quizContainer.style.display = "block";
  showQuestion();
});

function showQuestion() {
  const current = questions[currentQuestionIndex];
  quizQuestion.innerHTML = `<h2>${current.question}</h2>`;
  quizOptions.innerHTML = "";
  quizError.style.display = "none";

  current.options.forEach((option, index) => {
    const optionId = `question-${currentQuestionIndex}-option-${index}`;

    const wrapper = document.createElement("div");
    wrapper.classList.add("quiz-option-wrapper");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${currentQuestionIndex}`;
    input.id = optionId;
    input.value = index;
    input.checked = selectedAnswers[currentQuestionIndex] === index;

    input.addEventListener("change", () => {
      selectedAnswers[currentQuestionIndex] = index;
    });

    const label = document.createElement("label");
    label.setAttribute("for", optionId);
    label.innerText = option.text;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    quizOptions.appendChild(wrapper);
  });

  prevBtn.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";
  nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? "Виж резултата" : "Напред";
}


nextBtn.addEventListener("click", () => {
  if (selectedAnswers[currentQuestionIndex] == null) {
    quizError.style.display = "block";
    return;
  }
  quizError.style.display = "none";

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  selectedAnswers = [];
  quizResult.style.display = "none";
  quizStart.style.display = "block";
});

function showResult() {
  const typeCounts = {};
  selectedAnswers.forEach((answerIndex, qIndex) => {
    const type = questions[qIndex].options[answerIndex].type;
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const sorted = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const resultType = sorted[0][0];

  quizScore.innerHTML = `Ти си: <strong>${resultType}</strong> 🧘‍♀️`;
  quizMessage.innerText = getResultMessage(resultType);

  quizContainer.style.display = "none";
  quizResult.style.display = "block";
}

function getResultMessage(type) {
  switch (type) {
    case "Природолюбител":
      return "Ти се зареждаш от природата и обичаш да намираш баланс в нейната красота 🌿";
    case "Спокоен ум":
      return "Твоята сила е вътрешният мир. Ти обичаш тишината и моментите на осъзнатост 🧘";
    case "Социален оптимист":
      return "Ти черпиш енергия от хората около теб и вярваш, че усмивката лекува 😊";
    case "Креативен беглец":
      return "Твоят начин за релакс е чрез въображението – книги, изкуство, фантазия 🎨";
    default:
      return "Уникален си! Продължавай да откриваш себе си!";
  }
}

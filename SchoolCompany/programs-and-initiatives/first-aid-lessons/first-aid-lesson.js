// 1. Пълен масив с 20 въпроса
const allQuizData = [
    {
      question: "Какво трябва да направите първо, ако някой припадне?",
      options: ["Да му дадете вода", "Да проверите дали диша", "Да му викнете", "Да го поставите в седнало положение"],
      correct: 1
    },
    {
      question: "Кое е най-важното при спиране на кървене?",
      options: ["Да почистите раната", "Да я превържете с марля", "Да приложите директен натиск", "Да измиете с вода"],
      correct: 2
    },
    {
      question: "Какво НЕ трябва да се прави при изгаряне?",
      options: ["Да сложите лед", "Да охладите с вода", "Да не пукате мехури", "Да покриете с чиста кърпа"],
      correct: 0
    },
    {
      question: "Какво показва пулсът?",
      options: ["Скоростта на дишане", "Кръвното налягане", "Сърдечната честота", "Температурата на тялото"],
      correct: 2
    },
    {
      question: "Кога трябва да се потърси спешна помощ?",
      options: ["При лека болка в стомаха", "При главоболие", "При затруднено дишане", "При кашлица"],
      correct: 2
    },
    {
      question: "Кое е най-подходящото за обработка на лека рана?",
      options: ["Алкохол", "Йод", "Течаща вода и сапун", "Пероксид"],
      correct: 2
    },
    {
      question: "Как се проверява съзнание при човек в безсъзнание?",
      options: ["С натиск върху гърдите", "Със силен вик и разклащане", "Със студена вода", "Чрез измерване на пулса"],
      correct: 1
    },
    {
      question: "Как се оказва помощ при задавяне?",
      options: ["Прави се изкуствено дишане", "Извършва се Heimlich маневра", "Давате вода", "Изчаквате да се успокои"],
      correct: 1
    },
    {
      question: "Кое е важно при топлинен удар?",
      options: ["Да се постави в гореща стая", "Да се остави сам", "Да се охлади и хидратира", "Да се намаже с крем"],
      correct: 2
    },
    {
      question: "Какво да направите при ухапване от насекомо?",
      options: ["Да изцедите мястото", "Да охладите и наблюдавате за алергия", "Да разтъркате с алкохол", "Да го оставите без внимание"],
      correct: 1
    },
    {
      question: "Какво да направите при подуване на глезен?",
      options: ["Да загреете мястото", "Да продължите да ходите", "Да приложите студ и покой", "Да го игнорирате"],
      correct: 2
    },
    {
      question: "Какво да направите при слънчево изгаряне?",
      options: ["Да нанесете слънцезащитен крем", "Да излезете от слънце и да охладите мястото", "Да пиете кафе", "Да спортувате"],
      correct: 1
    },
    {
      question: "Какво да направите при токов удар?",
      options: ["Да го хванете веднага", "Да изключите електричеството и повикате помощ", "Да му дадете вода", "Да го поливате със студена вода"],
      correct: 1
    },
    {
      question: "Какво показва високата температура?",
      options: ["Добро здраве", "Хипотермия", "Инфекция или възпаление", "Недоспиване"],
      correct: 2
    },
    {
      question: "Как се оказва първа помощ при кръвотечение от носа?",
      options: ["Навеждате главата назад", "Навеждате главата напред и притискате носа", "Лягате по гръб", "Пиете студена вода"],
      correct: 1
    },
    {
      question: "Кое е вярно при употреба на бинт?",
      options: ["Стегнете колкото може", "Оставете пръстите сини", "Бинтът трябва да бъде плътно, но не твърде стегнат", "Навийте го произволно"],
      correct: 2
    },
    {
      question: "Какво да направите при алергична реакция?",
      options: ["Да я пренебрегнете", "Да дадете алерген", "Да дадете антихистамин и потърсите помощ", "Да разтриете мястото"],
      correct: 2
    },
    {
      question: "Какво НЕ трябва да правите при фрактура?",
      options: ["Да обездвижите", "Да местите пострадалия", "Да извикате помощ", "Да поддържате спокойствие"],
      correct: 1
    },
    {
      question: "Какво е основното правило при първа помощ?",
      options: ["Паника и бързина", "Безмислено действие", "Спокойствие и безопасност", "Игнориране на ситуацията"],
      correct: 2
    },
    {
      question: "Кое е вярно за изкуственото дишане?",
      options: ["Не се използва при деца", "Става чрез натиск на стомаха", "Комбинира се с натиск на гърдите", "Използва се само при спортисти"],
      correct: 2
    }
  ];
  
  // 2. Променливи
  let currentQuestion = 0;
  let userAnswers = [];
  let quizData = [];
  
  // 3. Елементи
  const quizContainer = document.getElementById("quiz-container");
  const quizStart = document.getElementById("quiz-start");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizError = document.getElementById("quiz-error");
  const prevBtn = document.getElementById("prev-question");
  const nextBtn = document.getElementById("next-question");
  const resultContainer = document.getElementById("quiz-result");
  const resultScore = document.getElementById("quiz-score");
  const resultMessage = document.getElementById("quiz-message");
  const cardsContainer = document.getElementById("quiz-cards");
  const quizH3Element = document.querySelector('.quiz-section h3');
  
  // 4. Функция за разбъркване
  function shuffleArray(array) {
    return array.map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);
  }
  
  // 5. Старт
  document.getElementById("start-quiz").addEventListener("click", () => {
    quizStart.style.display = "none";
    quizContainer.style.display = "block";
    resultContainer.style.display = "none";
    currentQuestion = 0;
  
    const shuffledAllQuestions = shuffleArray(allQuizData);
    quizData = shuffledAllQuestions.slice(0, 10);
  
    shuffledQuizData = quizData.map(q => {
      const options = shuffleArray([...q.options]);
      const newCorrectIndex = options.indexOf(q.options[q.correct]);
      return {
        question: q.question,
        options: options,
        correct: newCorrectIndex
      };
    });
  
    userAnswers = new Array(shuffledQuizData.length).fill(null);
    renderQuestion();
  });
  
  // 6. Напред
  nextBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      quizError.style.display = "block";
      return;
    }
  
    quizError.style.display = "none";
    userAnswers[currentQuestion] = parseInt(selected.value);
  
    if (currentQuestion === shuffledQuizData.length - 1) {
      showResult();
    } else {
      currentQuestion++;
      renderQuestion();
    }
  });
  
  // 7. Назад
  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
  });
  
  // 8. Рендериране на въпрос
  function renderQuestion() {
    const q = shuffledQuizData[currentQuestion];
    quizQuestion.textContent = `${currentQuestion + 1}. ${q.question}`;
    quizOptions.innerHTML = "";
  
    q.options.forEach((opt, i) => {
      const checked = userAnswers[currentQuestion] === i ? "checked" : "";
      quizOptions.innerHTML += `
        <label class="quiz-option">
          <input type="radio" name="answer" value="${i}" ${checked}> ${opt}
        </label>
      `;
    });
  
    prevBtn.style.display = currentQuestion === 0 ? "none" : "inline-block";
    nextBtn.textContent = currentQuestion === shuffledQuizData.length - 1 ? "Завърши" : "Напред";
  }
  
  // 9. Показване на резултата
  function showResult() {
    quizH3Element.textContent = "Край!";
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";
  
    const score = userAnswers.reduce((acc, ans, i) =>
      ans === shuffledQuizData[i].correct ? acc + 1 : acc, 0);
  
    resultScore.textContent = `Точки: ${score} от ${shuffledQuizData.length}`;
    resultMessage.textContent =
      score === shuffledQuizData.length
        ? "🏆 Отлично! Знаеш как да помогнеш в критичен момент!"
        : score >= 7
        ? "👏 Добре се справи! Знанията ти са стабилни."
        : "📘 Продължавай да учиш – всяко знание е важно!";
  }
  
  // 10. Рестартиране
  document.getElementById("restartQuiz").addEventListener("click", () => {
    quizH3Element.textContent = "Тествай знанията си по Първа помощ!";
    quizStart.style.display = "block";
    quizContainer.style.display = "none";
    resultContainer.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
  // 11. Отваряне/затваряне на карти
  document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', function () {
      const card = this.closest('.first-aid-card');
      const shortText = card.querySelector('.short-text');
      const fullText = card.querySelector('.full-text');
      const dots = shortText.querySelector('.dots');
  
      const isOpen = fullText.style.display === 'block';
  
      if (isOpen) {
        // Затваряне
        fullText.style.opacity = 0;
        setTimeout(() => {
          fullText.style.display = 'none';
          dots.style.display = 'inline';
          button.textContent = 'Научи повече';
        }, 300);
      } else {
        // Отваряне
        fullText.style.display = 'block';
        setTimeout(() => {
          fullText.style.opacity = 1;
        }, 10);
        dots.style.display = 'none';
        button.textContent = 'Покажи по-малко';
      }
    });
  });
  
  
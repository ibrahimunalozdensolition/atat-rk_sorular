let currentIndex = 0;
let score = 0;
let answered = false;
let uiTurkish = false;

const shuffled = [...questions].sort(() => Math.random() - 0.5);

const questionText   = document.getElementById('questionText');
const optionsList    = document.getElementById('optionsList');
const feedback       = document.getElementById('feedback');
const btnNext        = document.getElementById('btnNext');
const questionCounter = document.getElementById('questionCounter');
const scoreDisplay   = document.getElementById('scoreDisplay');
const progressBar    = document.getElementById('progressBar');
const quizArea       = document.getElementById('quizArea');
const resultScreen   = document.getElementById('resultScreen');
const finalScore     = document.getElementById('finalScore');
const btnRestart     = document.getElementById('btnRestart');

function loadQuestion() {
  answered = false;
  feedback.textContent = '';
  feedback.className = 'feedback';
  btnNext.style.display = 'none';

  const q = shuffled[currentIndex];
  const qStr = uiTurkish && q.questionTR ? q.questionTR : q.question;
  questionText.textContent = `${currentIndex + 1}. ${qStr}`;
  questionCounter.textContent = uiTurkish
    ? `Soru ${currentIndex + 1} / ${shuffled.length}`
    : `Question ${currentIndex + 1} / ${shuffled.length}`;
  progressBar.style.width = `${(currentIndex / shuffled.length) * 100}%`;

  optionsList.innerHTML = '';
  Object.entries(q.options).forEach(([letter, text]) => {
    const labelText = uiTurkish && q.optionsTR && q.optionsTR[letter] ? q.optionsTR[letter] : text;
    const li = document.createElement('li');
    li.dataset.letter = letter;
    li.innerHTML = `<span class="letter">${letter}</span><span class="opt-label">${labelText}</span>`;
    li.addEventListener('click', () => selectAnswer(li, letter, q.answer));
    optionsList.appendChild(li);
  });
}

function updateQuestionLanguage() {
  const q = shuffled[currentIndex];
  const qStr = uiTurkish && q.questionTR ? q.questionTR : q.question;
  questionText.textContent = `${currentIndex + 1}. ${qStr}`;
  questionCounter.textContent = uiTurkish
    ? `Soru ${currentIndex + 1} / ${shuffled.length}`
    : `Question ${currentIndex + 1} / ${shuffled.length}`;
  optionsList.querySelectorAll('li').forEach(li => {
    const letter = li.dataset.letter;
    const labelText = uiTurkish && q.optionsTR && q.optionsTR[letter] ? q.optionsTR[letter] : q.options[letter];
    const el = li.querySelector('.opt-label');
    if (el) el.textContent = labelText;
  });
}

function selectAnswer(selectedLi, chosen, correct) {
  if (answered) return;
  answered = true;

  const allItems = optionsList.querySelectorAll('li');
  allItems.forEach(li => li.classList.add('disabled'));

  if (chosen === correct) {
    selectedLi.classList.add('correct');
    feedback.textContent = '✓ Correct!';
    feedback.className = 'feedback correct-msg';
    score++;
  } else {
    selectedLi.classList.add('wrong');
    feedback.textContent = `✗ Wrong! Correct answer: ${correct.toUpperCase()}`;
    feedback.className = 'feedback wrong-msg';
    allItems.forEach(li => {
      if (li.dataset.letter === correct) li.classList.add('correct');
    });
  }

  scoreDisplay.textContent = `Score: ${score}`;
  btnNext.style.display = 'inline-block';
}

btnNext.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < shuffled.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

btnRestart.addEventListener('click', () => {
  currentIndex = 0;
  score = 0;
  shuffled.sort(() => Math.random() - 0.5);
  scoreDisplay.textContent = 'Score: 0';
  resultScreen.style.display = 'none';
  quizArea.style.display = 'block';
  loadQuestion();
});

function showResult() {
  quizArea.style.display = 'none';
  resultScreen.style.display = 'block';
  progressBar.style.width = '100%';
  const pct = Math.round((score / shuffled.length) * 100);
  finalScore.textContent = `You got ${score} out of ${shuffled.length} correct (${pct}%)`;
}

loadQuestion();

const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
  uiTurkish = !uiTurkish;
  langToggle.textContent = uiTurkish ? 'English' : 'Türkçe';
  if (quizArea.style.display !== 'none') {
    updateQuestionLanguage();
  }
});

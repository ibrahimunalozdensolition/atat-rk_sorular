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
const btnOpenList = document.getElementById('btnOpenList');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

langToggle.addEventListener('click', () => {
  uiTurkish = !uiTurkish;
  langToggle.textContent = uiTurkish ? 'English' : 'Türkçe';
  btnOpenList.textContent = uiTurkish ? 'Tüm sorular' : 'All questions';
  if (quizArea.style.display !== 'none') {
    updateQuestionLanguage();
  }
  applyModalLanguage();
});

btnOpenList.addEventListener('click', () => {
  buildModal();
  modalOverlay.classList.add('open');
});

modalClose.addEventListener('click', () => modalOverlay.classList.remove('open'));

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('open');
});

function applyModalLanguage() {
  if (!modalBody.hasChildNodes()) return;
  modalBody.querySelectorAll('.q-item').forEach((item, i) => {
    const q = questions[i];
    if (!q) return;
    const qEl = item.querySelector('.q-question-text');
    if (qEl) {
      qEl.textContent = uiTurkish && q.questionTR ? q.questionTR : q.question;
    }
    Object.entries(q.options).forEach(([letter, text]) => {
      const optText = item.querySelector(`.q-opt[data-letter="${letter}"] .q-opt-text`);
      if (!optText) return;
      const tr = q.optionsTR && q.optionsTR[letter];
      optText.textContent = uiTurkish && tr ? tr : text;
    });
  });
}

function buildModal() {
  if (modalBody.hasChildNodes()) return;
  questions.forEach((q, i) => {
    const item = document.createElement('div');
    item.className = 'q-item';

    const header = document.createElement('div');
    header.className = 'q-item-header';
    const num = document.createElement('div');
    num.className = 'q-num';
    num.textContent = `Soru ${i + 1}`;
    const qText = document.createElement('div');
    qText.className = 'q-question-text q-en';
    qText.textContent = q.question;
    header.appendChild(num);
    header.appendChild(qText);

    const opts = document.createElement('div');
    opts.className = 'q-options';

    Object.entries(q.options).forEach(([letter, text]) => {
      const opt = document.createElement('div');
      opt.className = 'q-opt' + (letter === q.answer ? ' correct-opt' : '');
      opt.dataset.letter = letter;
      const letterSpan = document.createElement('span');
      letterSpan.className = 'opt-letter';
      letterSpan.textContent = letter.toUpperCase();
      const textsWrap = document.createElement('span');
      textsWrap.className = 'opt-texts';
      const optText = document.createElement('span');
      optText.className = 'q-opt-text opt-text-en';
      optText.textContent = text;
      textsWrap.appendChild(optText);
      opt.appendChild(letterSpan);
      opt.appendChild(textsWrap);
      opts.appendChild(opt);
    });

    item.appendChild(header);
    item.appendChild(opts);
    modalBody.appendChild(item);
  });
  applyModalLanguage();
}

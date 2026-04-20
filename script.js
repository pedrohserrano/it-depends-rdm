const dataTypes = [
  "🪪 Personal data",
  "🎙️ Interview data",
  "📋 Survey data",
  "🩺 Health data",
  "🧬 Genetic data",
  "🎥 Audio/video recordings",
  "🖼️ Images/photos",
  "💻 Code/scripts",
  "🧪 Synthetic data",
  '🕶️ "Anonymous" data',
];

const questions = [
  "Can I share it openly?",
  "Do I need to collect consent?",
  "Can I store it in the cloud?",
  "Do I need a data processing agreement?"
];

const answers = [
  "It depends.",
  "It depends on the context.",
  "Yes and no.",
  "In principle, maybe. In practice, it depends.",
  "In some cases, maybe. In other cases, as well.",
  "Not necessarily. But also, possibly, so it depends.",
  "It depends on different factors."
];

const state = {
  selectedDataType: "",
  selectedQuestion: "",
};

const dataTypeOptions = document.getElementById("data-type-options");
const questionOptions = document.getElementById("question-options");
const questionStep = document.getElementById("question-step");
const showAnswerButton = document.getElementById("show-answer-button");
const resultPanel = document.getElementById("result-panel");
const resultAnswer = document.getElementById("result-title");
const resultDataType = document.getElementById("result-data-type");
const resultQuestion = document.getElementById("result-question");
const resetButton = document.getElementById("reset-button");

function createChoiceButton(label, groupName, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-card";
  button.setAttribute("role", "radio");
  button.setAttribute("aria-checked", "false");
  button.dataset.value = label;
  button.dataset.group = groupName;
  button.innerHTML = `<span class="choice-title">${label}</span>`;
  button.addEventListener("click", () => onSelect(label));
  return button;
}

function renderOptions(container, items, groupName, onSelect) {
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    fragment.appendChild(createChoiceButton(item, groupName, onSelect));
  });

  container.appendChild(fragment);
}

function updateSelection(container, selectedValue) {
  const buttons = container.querySelectorAll(".choice-card");

  buttons.forEach((button) => {
    const isSelected = button.dataset.value === selectedValue;
    button.setAttribute("aria-checked", String(isSelected));
  });
}

function updateQuestionStep() {
  const hasDataType = Boolean(state.selectedDataType);
  questionStep.classList.toggle("is-disabled", !hasDataType);
  questionStep.setAttribute("aria-hidden", String(!hasDataType));

  questionOptions.querySelectorAll(".choice-card").forEach((button) => {
    button.disabled = !hasDataType;
  });
}

function updateActionState() {
  showAnswerButton.disabled = !(state.selectedDataType && state.selectedQuestion);
}

function selectDataType(value) {
  state.selectedDataType = value;
  state.selectedQuestion = "";
  updateSelection(dataTypeOptions, state.selectedDataType);
  updateSelection(questionOptions, state.selectedQuestion);
  updateQuestionStep();
  updateActionState();
  resultPanel.classList.add("hidden");

  if (!questionStep.classList.contains("is-disabled")) {
    questionStep.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectQuestion(value) {
  if (!state.selectedDataType) {
    return;
  }

  state.selectedQuestion = value;
  updateSelection(questionOptions, state.selectedQuestion);
  updateActionState();
}

function randomAnswer() {
  const index = Math.floor(Math.random() * answers.length);
  return answers[index];
}

function showAnswer() {
  if (!state.selectedDataType || !state.selectedQuestion) {
    return;
  }

  resultAnswer.textContent = randomAnswer();
  resultDataType.textContent = state.selectedDataType;
  resultQuestion.textContent = state.selectedQuestion;
  resultPanel.classList.remove("hidden");
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetFlow() {
  state.selectedDataType = "";
  state.selectedQuestion = "";
  updateSelection(dataTypeOptions, state.selectedDataType);
  updateSelection(questionOptions, state.selectedQuestion);
  updateQuestionStep();
  updateActionState();
  resultPanel.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

showAnswerButton.addEventListener("click", showAnswer);
resetButton.addEventListener("click", resetFlow);

renderOptions(dataTypeOptions, dataTypes, "data-type", selectDataType);
renderOptions(questionOptions, questions, "question", selectQuestion);
updateQuestionStep();
updateActionState();

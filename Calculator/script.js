const display = document.getElementById("display");
const keys = document.querySelector(".keys");
const ceRow = document.querySelector(".ce_row");

// calculator state
let currentOperand = "0";   // the number currently being typed (last part of the expression)
let previousValue = null;   // the number stored before an operator was pressed
let currentOperator = null; // "add" | "subtract" | "multiply" | "divide" | null
let waitingForNext = false; // true right after an operator is pressed, before any digit is typed

const operatorSymbol = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

function getDisplayText() {
  if (currentOperator === null) {
    return currentOperand;
  }
  return previousValue + operatorSymbol[currentOperator] + currentOperand;
}

function updateDisplay() {
  display.textContent = getDisplayText();
}

function inputDigit(digit) {
  if (waitingForNext) {
    currentOperand = digit;
    waitingForNext = false;
  } else {
    currentOperand = currentOperand === "0" ? digit : currentOperand + digit;
  }
}

function inputDecimal() {
  if (waitingForNext) {
    currentOperand = "0.";
    waitingForNext = false;
    return;
  }
  if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
}

function clearAll() {
  currentOperand = "0";
  previousValue = null;
  currentOperator = null;
  waitingForNext = false;
}

function clearEntry() {
  if (waitingForNext || currentOperand === "0" || currentOperand === "") {
    if (currentOperator !== null) {
      currentOperand = String(previousValue);
      previousValue = null;
      currentOperator = null;
      waitingForNext = false;
    }
    return;
  }
  currentOperand = currentOperand.length > 1 ? currentOperand.slice(0, -1) : "0";
}

function toggleSign() {
  if (currentOperand === "0") return;
  currentOperand = currentOperand.startsWith("-")
    ? currentOperand.slice(1)
    : "-" + currentOperand;
}

function toPercent() {
  currentOperand = String(parseFloat(currentOperand) / 100);
}

function calculate(a, b, operator) {
  switch (operator) {
    case "add": return a + b;
    case "subtract": return a - b;
    case "multiply": return a * b;
    case "divide": return b === 0 ? "Error" : a / b;
    default: return b;
  }
}

function handleOperator(operator) {
  const inputValue = parseFloat(currentOperand);

  if (previousValue !== null && !waitingForNext) {
    const result = calculate(previousValue, inputValue, currentOperator);
    previousValue = result === "Error" ? 0 : result;
  } else if (previousValue === null) {
    previousValue = inputValue;
  }

  currentOperator = operator;
  currentOperand = "";
  waitingForNext = true;
}

function handleEquals() {
  if (currentOperator === null || currentOperand === "") return;

  const inputValue = parseFloat(currentOperand);
  const result = calculate(previousValue, inputValue, currentOperator);

  currentOperand = String(result);
  previousValue = null;
  currentOperator = null;
  waitingForNext = false;
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const { number, action } = button.dataset;

  if (number !== undefined) {
    inputDigit(number);
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "clear") {
    clearAll();
  } else if (action === "sign") {
    toggleSign();
  } else if (action === "percent") {
    toPercent();
  } else if (action === "equals") {
    handleEquals();
  } else if (["add", "subtract", "multiply", "divide"].includes(action)) {
    handleOperator(action);
  }

  updateDisplay();
});

ceRow.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  clearEntry();
  updateDisplay();
});

// keyboard support
const keyToOperator = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide"
};

window.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key >= "0" && key <= "9") {
    inputDigit(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (keyToOperator[key]) {
    event.preventDefault(); // stop "/" from triggering browser quick-find, etc.
    handleOperator(keyToOperator[key]);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    handleEquals();
  } else if (key === "Backspace") {
    clearEntry();
  } else if (key === "Escape") {
    clearAll();
  } else if (key === "%") {
    toPercent();
  } else {
    return; // ignore any other key, skip updateDisplay()
  }

  updateDisplay();
});

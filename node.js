let current = "0";
let prev = null;
let op = null;
let waitNext = false;
let exprStr = "";

const display = document.getElementById("display");
const expression = document.getElementById("expression");
const memStatus = document.getElementById("memStatus");

function updateDisplay(val) {
  const s = String(val);
  display.textContent = s.length > 11 ? parseFloat(val).toExponential(4) : s;
  display.classList.remove("flash");
  void display.offsetWidth;
  display.classList.add("flash");
}

function input(digit) {
  if (waitNext) {
    current = digit;
    waitNext = false;
  } else {
    current =
      current === "0" ? digit : current.length < 12 ? current + digit : current;
  }
  updateDisplay(current);
}

function inputDot() {
  if (waitNext) {
    current = "0.";
    waitNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  updateDisplay(current);
}

function setOp(o) {
  if (op && !waitNext) calculate(true);
  prev = parseFloat(current);
  op = o;
  waitNext = true;
  const opSymbols = { "/": "÷", "*": "×", "-": "−", "+": "+" };
  exprStr = current + " " + (opSymbols[o] || o);
  expression.textContent = exprStr;
  memStatus.textContent = "MEM:STORE";
}

function calculate(silent) {
  if (op === null || prev === null) return;
  const cur = parseFloat(current);
  let result;
  switch (op) {
    case "+":
      result = prev + cur;
      break;
    case "-":
      result = prev - cur;
      break;
    case "*":
      result = prev * cur;
      break;
    case "/":
      result = cur === 0 ? "ERR:DIV0" : prev / cur;
      break;
  }
  if (!silent) {
    const opSymbols = { "/": "÷", "*": "×", "-": "−", "+": "+" };
    expression.textContent = exprStr + " " + current + " =";
  }
  const display_result =
    typeof result === "number"
      ? Number.isInteger(result)
        ? result
        : parseFloat(result.toPrecision(10))
      : result;
  current = String(display_result);
  updateDisplay(display_result);
  if (!silent) {
    op = null;
    prev = null;
    exprStr = "";
    memStatus.textContent = "MEM:CLEAR";
  }
  waitNext = !silent;
}

function clearAll() {
  current = "0";
  prev = null;
  op = null;
  waitNext = false;
  exprStr = "";
  expression.textContent = "";
  memStatus.textContent = "MEM:CLEAR";
  updateDisplay("0");
}

function toggleSign() {
  current = String(parseFloat(current) * -1);
  updateDisplay(current);
}

function percent() {
  current = String(parseFloat(current) / 100);
  updateDisplay(current);
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") input(e.key);
  else if (e.key === ".") inputDot();
  else if (e.key === "+") setOp("+");
  else if (e.key === "-") setOp("-");
  else if (e.key === "*") setOp("*");
  else if (e.key === "/") {
    e.preventDefault();
    setOp("/");
  } else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Escape") clearAll();
  else if (e.key === "Backspace") {
    if (current.length > 1) current = current.slice(0, -1);
    else current = "0";
    updateDisplay(current);
  }
});

// Ripple effect
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const r = document.createElement("span");
    r.className = "ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 400);
  });
});

const quoteArea = document.querySelector(".quote");
const restartButton = document.getElementById("restart");
const inputField = document.getElementById("input-field");
let timerEl = document.getElementById("timer");
let lastIndex = -1;
let timerId = null;
let startTime = 0;
let currentQuote = ""
const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast is not about rushing, but about rhythm and precision.",
    "When coding becomes second nature, creativity takes the lead.",
    "Practice every day, even for ten minutes, and progress will surprise you.",
    "Curiosity fuels growth; every mistake is a step toward mastery."
]

restartButton.onclick = pickQuote;

function randomise(){
    let newIndex = Math.floor(Math.random() * quotes.length);

  // keep generating until it's different from the last one
  while (newIndex === lastIndex) {
    newIndex = Math.floor(Math.random() * quotes.length);
  }

  // use the final, different index
  currentQuote = quotes[newIndex];
  quoteArea.innerHTML = "";


  currentQuote.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    quoteArea.appendChild(span);
  })

  // remember this index for next time
  lastIndex = newIndex;
}

function pickQuote() {
    randomise();

    //Reset timer
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
    timerEl.textContent = "0";

    //Reset input field
    inputField.value = ""
    inputField.focus();
    inputField.classList.remove("completed");
    inputField.style.borderColor = "";
    document.getElementById("wpm").textContent = ""
    if (inputField.disabled === true) {
        inputField.disabled = false;
    }
}


function startTimer() {
    if (timerId !==  null) return;
    startTime = Date.now();
    timerId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerEl.textContent = String(elapsed);
    }, 1000);
}


function handleTyping() {
   if (timerId === null) {
    startTimer();
   } 

   const userInput = inputField.value;
   let targetQuote = quoteArea.textContent;

   if (targetQuote.startsWith(userInput)) {
    inputField.style.borderColor = "green"; 
   } else {
    inputField.style.borderColor = "red";
   }

   const spans = quoteArea.querySelectorAll("span");

   for (let i = 0; i < spans.length; i++) {
    const typedChar = userInput[i];
    const span = spans[i];
    const expectedChar = currentQuote[i];
    
    if (typedChar == null) {
       span.classList.remove("correct", "incorrect");
    }  else if (typedChar === expectedChar) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
    } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");   
    }
   }

   if (userInput === targetQuote){
        clearInterval(timerId);
        timerId = null;
        inputField.disabled = true;
        inputField.classList.add("completed");
        
        const elapsedSeconds = Number(timerEl.textContent);
        const elapsedMinutes = elapsedSeconds / 60;
        const characterCount = userInput.length;
        const wpm = (characterCount / 5) / elapsedMinutes;

        document.getElementById("wpm").textContent = wpm.toFixed(0);
   }
}

inputField.addEventListener('input', handleTyping);
pickQuote();
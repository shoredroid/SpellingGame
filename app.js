let points = parseInt(localStorage.getItem("points")) || 0; // Load points from local storage
let money = parseFloat(localStorage.getItem("money")) || 0.00; // Load money from local storage
let wordList = JSON.parse(localStorage.getItem("wordList")) || []; // Load word list from local storage
const pointsDisplay = document.getElementById("pointsDisplay");
const moneyDisplay = document.getElementById("moneyDisplay");
let isUpperCase = true; // Start with uppercase letters

// Update local storage for wordList, points, and money
function updateLocalStorage() {
    localStorage.setItem("wordList", JSON.stringify(wordList));
    localStorage.setItem("points", points); // Save points to local storage
    localStorage.setItem("money", money.toFixed(2)); // Save money to local storage
}

function addWord() {
    const newWord = document.getElementById("newWord").value.trim();
    if (newWord) {
        wordList.push(newWord.toLowerCase());
        document.getElementById("newWord").value = "";
        alert("Word added successfully!");
        updateLocalStorage();  // Update local storage after adding word
    }
}

document.getElementById("newWord").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addWord();
    }
});

document.getElementById("answer").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

function submitAnswer() {
    const answer = document.getElementById("answer").value.trim().toLowerCase();
    const wordPrompt = document.getElementById("wordPrompt").innerText.toLowerCase();
    
    if (answer === wordPrompt) {
        points++;
        document.getElementById("feedback").innerText = "Correct!";
        if (points % 10 === 0) {
            money++;
            triggerStarAnimation();
        }
    } else {
        document.getElementById("feedback").innerText = "Try again!";
    }

    document.getElementById("answer").value = ""; // Automatically clear the answer field for the next word

    updateScore();
    updateLocalStorage();  // Save points and money to local storage
    nextWord();
}

function updateScore() {
    pointsDisplay.innerText = points;
    moneyDisplay.innerText = money.toFixed(2);
}

function triggerStarAnimation() {
    const starElement = document.createElement('div');
    starElement.classList.add('star');
    starElement.innerHTML = '★';
    const moneyContainer = document.querySelector('.money-display');
    moneyContainer.appendChild(starElement);
    
    setTimeout(() => {
        moneyContainer.removeChild(starElement);
    }, 1000);
}

function resetProgress() {
    points = 0;
    money = 0;
    updateScore();
    updateLocalStorage();  // Reset local storage as well
}

function resetMoney() {
    money = 0;
    updateScore();
    updateLocalStorage();  // Save the reset money to local storage
}

function nextWord() {
    if (wordList.length > 0) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        document.getElementById("wordPrompt").innerText = wordList[randomIndex];
    } else {
        document.getElementById("wordPrompt").innerText = "No words available. Please add words.";
    }
}

function startQuiz() {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("parentPanel").style.display = "none";
    document.getElementById("quizPanel").style.display = "block";
    nextWord();
}

function openParentalPanel() {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("parentPanel").style.display = "block";
}

function clearWordList() {
    wordList = [];
    updateLocalStorage();  // Clear local storage as well
    alert("Word list cleared!");
}

function backToLanding() {
    document.getElementById("quizPanel").style.display = "none";
    document.getElementById("parentPanel").style.display = "none";
    document.getElementById("landingPage").style.display = "block";
}

// Function to add letter to the answer field
function typeLetter(letter) {
    const answerField = document.getElementById("answer");
    if (!isUpperCase) {
        letter = letter.toLowerCase(); // Convert to lowercase if Shift is off
    }
    answerField.value += letter;
}

// Function to delete the last letter in the answer field
function deleteLetter() {
    const answerField = document.getElementById("answer");
    answerField.value = answerField.value.slice(0, -1);
}

// Function to clear the entire input field
function clearInput() {
    document.getElementById("answer").value = "";
}

// Function to toggle between uppercase and lowercase letters
function toggleCase() {
    isUpperCase = !isUpperCase;
    const keys = document.querySelectorAll('.key');
    
    keys.forEach((key) => {
        let letter = key.innerText;
        // Only change letter keys, not action buttons
        if (letter.length === 1 && /[a-zA-Z]/.test(letter)) {
            key.innerText = isUpperCase ? letter.toUpperCase() : letter.toLowerCase();
        }
    });
}

// Load the score when the app loads
window.onload = function() {
    updateScore(); // Ensure the points and money are displayed correctly
    nextWord(); // Load the first word in case quiz panel is opened
};

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // Register the service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

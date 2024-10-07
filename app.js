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

    // Function to add a new word
    function addWord() {
        const newWord = document.getElementById("newWord").value.trim();
        if (newWord) {
            wordList.push(newWord.toLowerCase());
            document.getElementById("newWord").value = "";
            alert("Word added successfully!");
            updateLocalStorage();  // Update local storage after adding word
        }
    }

    // Physical Enter key should trigger addWord in the parental panel
    document.getElementById("newWord").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission or refresh
            addWord(); // Call the add word function
        }
    });

    // Physical Enter key should trigger submitAnswer in the quiz panel
    document.getElementById("answer").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission or refresh
            submitAnswer(); // Call the submit function
        }
    });

    // Function to submit the answer
    function submitAnswer() {
        console.log('Submit Answer function called'); // Debug log

        const answerField = document.getElementById("answer");
        const answer = answerField.value.trim().toLowerCase();
        const wordPrompt = document.getElementById("wordPrompt"); // Get the word prompt element
        const quizPanel = document.getElementById("quizPanel"); // Get the quiz panel

        // Check if wordPrompt exists
        if (!wordPrompt) {
            console.error('Word prompt element not found!'); // Log error if not found
            return; // Exit if the element does not exist
        }

        // Check if the quiz panel is visible
        console.log('Quiz Panel Visibility:', quizPanel.style.display); // Log visibility state
        if (quizPanel.style.display === "none") {
            console.error('Quiz panel is not visible!'); // Log error if not visible
            return; // Exit if the quiz panel is hidden
        }

        const wordPromptText = wordPrompt.innerText.toLowerCase(); // Get innerText if the element exists
        console.log('Word Prompt:', wordPromptText); // Log the word prompt for debugging

        // Check if the answer matches the word prompt
        if (answer === wordPromptText) {
            points++;
            document.getElementById("feedback").innerText = "Correct!";
            if (points % 10 === 0) {
                money++;
                triggerStarAnimation();
            }
        } else {
            document.getElementById("feedback").innerText = "Try again!";
        }

        answerField.value = ""; // Automatically clear the answer field for the next word

        updateScore();
        updateLocalStorage();  // Save points and money to local storage
        nextWord();
    }

    // Function to update the displayed score
    function updateScore() {
        pointsDisplay.innerText = points;
        moneyDisplay.innerText = money.toFixed(2);
    }

    // Function to trigger star animation
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

    // Function to reset progress
    function resetProgress() {
        points = 0;
        money = 0;
        updateScore();
        updateLocalStorage();  // Reset local storage as well
    }

    // Function to reset money
    function resetMoney() {
        money = 0;
        updateScore();
        updateLocalStorage();  // Save the reset money to local storage
    }

    // Function to get the next word
    function nextWord() {
        if (wordList.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            document.getElementById("wordPrompt").innerText = wordList[randomIndex]; // Set a random word
        } else {
            document.getElementById("wordPrompt").innerText = "No words available. Please add words.";
        }
    }

    // Function to start the quiz
    function startQuiz() {
        document.getElementById("landingPage").style.display = "none";
        document.getElementById("parentPanel").style.display = "none";
        document.getElementById("quizPanel").style.display = "block"; // Show the quiz panel
        nextWord(); // Load the first word for the prompt
    }

    // Function to open the parental panel
    function openParentalPanel() {
        document.getElementById("landingPage").style.display = "none";
        document.getElementById("parentPanel").style.display = "block";
    }

    // Function to clear the word list
    function clearWordList() {
        wordList = [];
        updateLocalStorage();  // Clear local storage as well
        alert("Word list cleared!");
    }

    // Function to navigate back to the landing page
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
            // Only change letter keys, not action buttons (such as Enter, Delete)
            if (letter.length === 1 && /[a-zA-Z]/.test(letter)) {
                key.innerText = isUpperCase ? letter.toUpperCase() : letter.toLowerCase();
            }
        });
    }

    // Load the score when the app loads
    window.onload = function() {
        updateScore(); // Ensure the points and money are displayed correctly
        nextWord(); // Load the first word in case quiz panel is opened
    
    // Add the touchend event listener to all keys to prevent the "sticking" active state
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('touchend', function() {
            // Force the active state to end after the button is pressed
            this.classList.remove('active');
        });
    });
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

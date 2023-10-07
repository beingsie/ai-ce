let timerInterval;
let timeInSeconds = 300; // 5 minutes by default
let totalTimeInSeconds = 0; // Total time elapsed
let isTimerRunning = false;

const timerInput = document.getElementById("timerInput");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const timerDisplay = document.getElementById("timerDisplay");
const totalTimeDisplay = document.getElementById("totalTime");
const resetTotalTimeButton = document.getElementById("resetTotalTimeButton");

function updateDisplay() {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  timerDisplay.textContent = formattedTime;
}

function updateTotalTimeDisplay() {
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  totalTimeDisplay.textContent = formattedTime;
}

function toggleTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startButton.textContent = "Pause";
    timerInput.disabled = true;
    resetButton.disabled = false;

    timerInterval = setInterval(function () {
      if (timeInSeconds > 0) {
        timeInSeconds--;
        totalTimeInSeconds++;
        updateDisplay();
        updateTotalTimeDisplay();
        
        // Set the timer display in the browser title (add this line)
        document.title = `Timer: ${timerDisplay.textContent}`;
        
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startButton.textContent = "Start";
        timerInput.disabled = false;
        resetButton.disabled = true;

        // Play the alarm sound
        const alarmSound = document.getElementById("alarmSound");
        alarmSound.play();

        // Reset the timer to the initial value after completion
        timeInSeconds = parseInt(timerInput.value) * 60;
        updateDisplay();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startButton.textContent = "Resume";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  startButton.textContent = "Start";
  timerInput.disabled = false;
  resetButton.disabled = true;
  if (isTimerRunning) {
    totalTimeInSeconds += parseInt(timerInput.value) * 60 - timeInSeconds; // Add only the remaining time
  }
  timeInSeconds = parseInt(timerInput.value) * 60;
  updateDisplay();
  updateTotalTimeDisplay();
}

function updateTimer() {
  if (!isTimerRunning) {
    timeInSeconds = parseInt(timerInput.value) * 60;
    updateDisplay();
  }
}

function resetTotalTime() {
  totalTimeInSeconds = 0;
  updateTotalTimeDisplay();
  saveDataToLocalStorage(); // Save the updated total time
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
  localStorage.setItem("totalTimeInSeconds", totalTimeInSeconds);
  localStorage.setItem("timerInputValue", timerInput.value);
}

// Function to retrieve data from localStorage
function retrieveDataFromLocalStorage() {
  totalTimeInSeconds =
    parseInt(localStorage.getItem("totalTimeInSeconds")) || 0;
  timerInput.value = localStorage.getItem("timerInputValue") || 25; // Default to 25 if no value is found
  timeInSeconds = parseInt(timerInput.value) * 60;
  updateDisplay();
  updateTotalTimeDisplay();
}

// Add event listeners
startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
timerInput.addEventListener("change", updateTimer);
resetTotalTimeButton.addEventListener("click", resetTotalTime);

// Add an event listener to save data when the window is unloaded
window.addEventListener("beforeunload", saveDataToLocalStorage);

// Call the function to retrieve data from localStorage
retrieveDataFromLocalStorage();
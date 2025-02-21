let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "green", "purple"];
let started = false;
let level = 0;
let highestScore = 0; // Track highest score across games

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  let h2 = document.querySelector("h2");
  let scoreDisplay = document.querySelector(".score-display");

  // Start or restart the game when a key is pressed or the screen is clicked
  function startGame() {
    if (!started) {
      reset();
      started = true;
      console.log("Game Started");
      levelUp();
    }
  }

  document.addEventListener("keydown", startGame);
  document.addEventListener("click", startGame);

  function gameflash(btn) {
    btn.classList.add("flash");
    setTimeout(() => {
      btn.classList.remove("flash");
    }, 250);
  }

  function userflash(btn) {
    btn.classList.add("userflash");
    setTimeout(() => {
      btn.classList.remove("userflash");
    }, 250);
  }

  function levelUp() {
    // Clear user input for this level and update level counter
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    // Add a new random color to the game sequence
    let randidx = Math.floor(Math.random() * btns.length);
    let randcolor = btns[randidx];
    gameSeq.push(randcolor);
    console.log("Game Sequence:", gameSeq);

    // Flash the entire sequence with delays
    let delay = 0;
    gameSeq.forEach((color) => {
      let btn = document.querySelector(`.${color}`);
      setTimeout(() => {
        gameflash(btn);
      }, delay);
      delay += 500; // Increase delay between flashes
    });
  }

  function checkAns(currentIndex) {
    if (userSeq[currentIndex] === gameSeq[currentIndex]) {
      // If user completed the sequence correctly, go to next level
      if (userSeq.length === gameSeq.length) {
        setTimeout(levelUp, 1000);
      }
    } else {
      // Wrong answer: trigger game over logic
      gameOver();
    }
  }

  // Accept event object to prevent event bubbling that restarts the game prematurely
  function btnPress(e) {
    e.stopPropagation();

    // Only register button presses if the game is in progress
    if (!started) return;

    let btn = this;
    userflash(btn);

    // Use the button's id to record the color pressed
    let usercolor = btn.getAttribute("id");
    userSeq.push(usercolor);
    console.log("User Sequence:", userSeq);

    checkAns(userSeq.length - 1);
  }

  // Attach click listeners to all buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", btnPress);
  });

  function gameOver() {
    // Flash the screen red to indicate a wrong input
    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);

    // Calculate score (level - 1) because level increments at the start of each level
    let currentScore = level - 1;
    // Update highestScore if the current score is higher
    if (currentScore > highestScore) {
      highestScore = currentScore;
    }

    // Display game over message with score and highest score
    h2.innerText = "Game Over! Press Any Key or Click to Restart";
    scoreDisplay.innerText = `Your Score: ${currentScore} | Highest Score: ${highestScore}`;
    scoreDisplay.style.display = "block"; // Make score visible

    started = false;
  }

  function reset() {
    // Reset game variables and instructions (but keep highestScore intact)
    gameSeq = [];
    userSeq = [];
    level = 0;
    h2.innerText = "Press Any Key or Click to Start the Game";
    scoreDisplay.style.display = "none"; // Hide score on restart
  }
});

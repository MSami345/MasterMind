let selectedColor = "";
const cursorIndicator = document.querySelector(".cursor-indicator");
const verifyButton = document.getElementById("verify-button");
let secretCode = [];
let currentRowIndex = 7; // Start from the bottom row (0-based index)
let flag = false;

const colors = [
  "rgb(0, 0, 0)",
  "rgb(0, 0, 255)",
  "rgb(165, 42, 42)",
  "rgb(255, 255, 0)",
  "rgb(0, 128, 0)",
  "rgb(255, 0, 0)",
  "rgb(255, 165, 0)",
  "rgb(128, 0, 128)",
];

// Function to generate a random sequence of 4 colors
const generateSecretCode = () => {
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    secretCode.push(colors[randomIndex]);
  }
  //   console.log("Secret Code:", secretCode); // For debugging
};

// Function to update the cursor indicator position
const updateCursorPosition = (e) => {
  cursorIndicator.style.left = `${e.pageX + 2}px`;
  cursorIndicator.style.top = `${e.pageY + 2}px`;
};

// Function to handle color selection
const handleColorSelection = (span) => {
  span.addEventListener("click", () => {
    currentColor = window.getComputedStyle(span).backgroundColor;
    if (selectedColor !== "" && selectedColor == currentColor) {
      selectedColor = ""; // Reset the selected color
      cursorIndicator.style.display = "none"; // Hide the cursor indicator
    } else {
      selectedColor = window.getComputedStyle(span).backgroundColor; // Select the color of the clicked span
      cursorIndicator.style.backgroundColor = selectedColor; // Update indicator color
      cursorIndicator.style.display = "block"; // Show the cursor indicator
    }
  });
};

// Function to handle updating circle colors
const updateCircleColor = (circle) => {
  circle.addEventListener("click", () => {
    if (selectedColor !== "") {
      circle.style.backgroundColor = selectedColor;
      checkRowCompletion();
    }
  });
};

// Function to check if the current row is fully filled
const checkRowCompletion = () => {
  const currentRowCircles = document.querySelectorAll(
    `.guess .rows:nth-child(${currentRowIndex + 1}) .circles span`
  );

  const filledCircles = Array.from(currentRowCircles).filter((circle) =>
    colors.includes(window.getComputedStyle(circle).backgroundColor)
  );
  //   console.log("Filled Circles:", filledCircles); // For debugging
  if (filledCircles.length === 4) {
    verifyButton.style.display = "block";
  } else {
    verifyButton.style.display = "none";
  }
};

// Function to verify the current row
const verifyCurrentRow = () => {
  const currentRowCircles = document.querySelectorAll(
    `.guess .rows:nth-child(${currentRowIndex + 1}) .circles span`
  );
  const currentRowResults = document.querySelectorAll(
    `.guess .rows:nth-child(${currentRowIndex + 1}) .result span`
  );
  let correctCount = 0;

  currentRowCircles.forEach((circle, index) => {
    if (circle.style.backgroundColor === secretCode[index]) {
      currentRowResults[index].style.backgroundColor = "red";
      correctCount++;
    }
  });

  if (correctCount === 4) {
    // alert("Congratulations! You guessed the correct sequence.");
    const winnerDiv = document.querySelector(".winner");
    winnerDiv.style.display = "block";
    flag = true;
    cursorIndicator.style.display = "none";

    const balls = document.querySelectorAll("#empty span");

    // Apply background colors to each span
    balls.forEach((span, index) => {
      span.style.backgroundColor = secretCode[index];
      span.innerHTML = " ";
    });
  } else if (currentRowIndex > 0) {
    currentRowIndex--; // Move to the next row
    verifyButton.style.display = "none";
  } else {
    const looser = document.querySelector(".looser");
    looser.style.display = "block";
    const balls = document.querySelectorAll("#empty span");

    // Apply background colors to each span
    balls.forEach((span, index) => {
      span.style.backgroundColor = secretCode[index];
      span.innerHTML = " ";
    });
    // alert("Game Over! You did not guess the sequence.");
  }
};

document.querySelectorAll(".Reset").forEach((button) => {
  button.addEventListener("click", () => {
    window.location.reload();
  });
});

// Attach color selection event listeners
document.querySelectorAll(".inner1 span, .inner2 span").forEach((span) => {
  if (flag == false) handleColorSelection(span);
});

// Attach event listeners to update circle colors
document.querySelectorAll(".circles span").forEach((span) => {
  if (flag == false) updateCircleColor(span);
});

// Attach event listener for cursor movement
document.addEventListener("mousemove", updateCursorPosition);

// Attach event listener to verify button
verifyButton.addEventListener("click", verifyCurrentRow);

// Generate the secret code when the page loads
generateSecretCode();

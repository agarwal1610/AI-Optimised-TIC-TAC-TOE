let boxes;
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let selectContainer = document.querySelector(".select-container");
let mainContainer = document.querySelector("main");
let pvpBtn = document.querySelector("#pvp-btn");
let pvbBtn = document.querySelector("#pvb-btn");
let difficultyContainer = document.querySelector(".difficulty");
let difficultyBtns = document.querySelectorAll(".difficulty-btn");
let gridSizeContainer = document.querySelector(".grid-size-container");
let gridSizeBtns = document.querySelectorAll(".grid-size-btn");

let turnO = true; // Player O's turn
let count = 0; // To track draw
let gameMode = "pvp"; // Default game mode
let difficulty = "easy"; // Default difficulty for PvB
let gridSize = 3; // Default grid size

const winPatterns3x3 = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const winPatterns4x4 = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];

const winPatterns5x5 = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  selectContainer.classList.remove("hide");
  mainContainer.classList.add("hide");
  difficultyContainer.classList.add("hide");
  gridSizeContainer.classList.add("hide");
};

const checkWinner = () => {
  let winPatterns;
  switch (gridSize) {
    case 3:
      winPatterns = winPatterns3x3;
      break;
    case 4:
      winPatterns = winPatterns4x4;
      break;
    case 5:
      winPatterns = winPatterns5x5;
      break;
  }
  for (let pattern of winPatterns) {
    let patternValues = pattern.map((index) => boxes[index].innerText);
    if (patternValues.every((val) => val === "O" || val === "X")) {
      if (new Set(patternValues).size === 1) {
        showWinner(patternValues[0]);
        return true;
      }
    }
  }
  return false;
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  setTimeout(resetGame, 10000); // Show options after game ends
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  setTimeout(resetGame, 10000); // Show options after game ends
};

const botMove = () => {
  let availableBoxes = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableBoxes.push(index);
    }
  });

  let move;
  if (difficulty === "easy") {
    move = availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
  } else if (difficulty === "medium") {
    move = mediumMove(availableBoxes);
  } else {
    move = hardMove(availableBoxes);
  }

  boxes[move].innerText = "X";
  boxes[move].disabled = true;
  count++;
  if (!checkWinner() && count === gridSize * gridSize) {
    gameDraw();
  }
  turnO = true;
};

const mediumMove = (availableBoxes) => {
  return availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
};

const hardMove = (availableBoxes) => {
  return availableBoxes[Math.floor(Math.random() * availableBoxes.length)];
};

const initializeGameBoard = () => {
  let gameBoard = document.querySelector(".game");
  gameBoard.innerHTML = ""; // Clear existing boxes

  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  let boxSize;
  switch (gridSize) {
    case 3:
      boxSize = "18vmin";
      break;
    case 4:
      boxSize = "13vmin";
      break;
    case 5:
      boxSize = "10vmin";
      break;
  }

  gameBoard.style.setProperty('--grid-size', gridSize);

  for (let i = 0; i < gridSize * gridSize; i++) {
    let box = document.createElement("button");
    box.classList.add("box");
    box.style.width = boxSize;
    box.style.height = boxSize;
    gameBoard.appendChild(box);
  }

  boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (gameMode === "pvp") {
        if (turnO) {
          box.innerText = "O";
          turnO = false;
        } else {
          box.innerText = "X";
          turnO = true;
        }
        box.disabled = true;
        count++;
        if (count === gridSize * gridSize && !checkWinner()) {
          gameDraw();
        } else {
          checkWinner();
        }
      } else if (gameMode === "pvb") {
        if (turnO) {
          box.innerText = "O";
          box.disabled = true;
          count++;
          if (!checkWinner() && count < gridSize * gridSize) {
            turnO = false;
            setTimeout(botMove, 500);
          }
        }
      }
    });
  });
};

pvpBtn.addEventListener("click", () => {
  gameMode = "pvp";
  selectContainer.classList.add("hide");
  gridSizeContainer.classList.remove("hide");
});

pvbBtn.addEventListener("click", () => {
  pvbBtn.addEventListener("click", () => {
    gameMode = "pvb";
    selectContainer.classList.add("hide");
    difficultyContainer.classList.remove("hide");
    // Add the line below to show "Select difficulty" text
    document.querySelector('.difficulty').querySelector('h1').innerText = "Select difficulty";
  });
  
});

difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    difficulty = e.target.getAttribute("data-difficulty");
    difficultyContainer.classList.add("hide");
    gridSizeContainer.classList.remove("hide");
  });
});

gridSizeBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    gridSize = parseInt(e.target.getAttribute("data-grid"));
    gridSizeContainer.classList.add("hide");
    mainContainer.classList.remove("hide");
    initializeGameBoard();
  });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Initial setup
resetGame();

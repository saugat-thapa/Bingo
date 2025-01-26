import { createRoot } from "react-dom/client";
import "./index.css";
import "./container.css";
import "./box.css";
import "./misc.css";

const row = 5;
const col = 5;

let usedNumbers: number[] = [];
let gameEnd = false;
let playerTurn = true;

// Track each player's 5x5 bingo grid
let playerGrid: number[][] = [];
let computerGrid: number[][] = [];

// Track marked cells
let playerMarked: boolean[][] = Array.from({ length: row }, () =>
  Array(col).fill(false)
);
let computerMarked: boolean[][] = Array.from({ length: row }, () =>
  Array(col).fill(false)
);

/** ✅ Creates an **empty** 5x5 grid with blank cells */
const emptyGrid = (boxNumber: number) => {
  const container = document.querySelector(`#box${boxNumber}`);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = ""; // Empty cell
      container.appendChild(cell);
    }
  }
};

/** ✅ Generates a unique 5x5 grid of numbers (1-25) */
const createCards = (): number[][] => {
  const usedNumbers: Set<number> = new Set();

  while (usedNumbers.size < 25) {
    let genNum = Math.floor(Math.random() * 25 + 1);
    usedNumbers.add(genNum);
  }

  const putNumbers = Array.from(usedNumbers);
  const cardNumbers: number[][] = [];

  for (let i = 0; i < row; i++) {
    cardNumbers.push(putNumbers.slice(i * col, (i + 1) * col));
  }

  return cardNumbers;
};

/** ✅ Fills the grid with numbers */
const createGrid = (cardNumbers: number[][], boxNumber: number) => {
  const container = document.querySelector(`#box${boxNumber}`);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = cardNumbers[i][j].toString();
      cell.dataset.row = i.toString();
      cell.dataset.col = j.toString();
      container.appendChild(cell);
    }
  }
};

/** ✅ Shows empty grids at the beginning */
const land = () => {
  emptyGrid(1);
  emptyGrid(2);
};
land();

/** ✅ Generates new grids with numbers when game starts */
const generate = () => {
  usedNumbers = [];
  playerTurn = true;
  gameEnd = false;

  playerGrid = createCards();
  computerGrid = createCards();

  playerMarked = Array.from({ length: row }, () => Array(col).fill(false));
  computerMarked = Array.from({ length: row }, () => Array(col).fill(false));

  createGrid(playerGrid, 1);
  createGrid(computerGrid, 2);

  document.querySelector(".start")?.classList.add("hidden");
  document.querySelector(".board")!.innerText = "";
  document.querySelector(".turn")?.classList.remove("hidden");
  document.querySelector(".wait")?.classList.remove("hidden");
  setupPlayerTurn();
};

const resetGame = () => {
  usedNumbers = [];
  gameEnd = false;
  playerTurn = true;

  playerGrid = [];
  computerGrid = [];

  playerMarked = Array.from({ length: row }, () => Array(col).fill(false));
  computerMarked = Array.from({ length: row }, () => Array(col).fill(false));

  markedLinesPlayer = 0;
  markedLinesComputer = 0;
  playerBingo = 0;
  computerBingo = 0;

  markedRowsPlayer.fill(false);
  markedColumnsPlayer.fill(false);
  markedDiagonalsPlayer.fill(false);
  markedRowsComputer.fill(false);
  markedColumnsComputer.fill(false);
  markedDiagonalsComputer.fill(false);

  // Reset the board's background color
  const board = document.querySelector(".board") as HTMLElement;
  board.innerHTML = "BINGO";
  board.style.lineHeight = "90px";
  board.style.backgroundColor = "white"; // Reset to default white

  // Reset grid colors
  document.querySelectorAll(".cell").forEach((cell) => {
    (cell as HTMLElement).style.backgroundColor = "white"; // Reset cell colors
  });

  // Reset BINGO word color
  document.querySelectorAll(".b1 div, #b2 div").forEach((letter) => {
    (letter as HTMLElement).style.backgroundColor = "white"; // Reset BINGO letters
    letter.classList.remove("bingo-animate"); // Remove any animation class
  });

  // Show empty grids again
  land();

  // Show start button again
  document.querySelector(".start")?.classList.remove("hidden");
  document.querySelector(".reset")?.classList.add("hidden");
};

/** ✅ Animates selected numbers */
const duplicateAndAnimate = (
  cell: HTMLElement,
  num: string,
  callback: () => void
) => {
  const board = document.querySelector(".board") as HTMLElement;
  if (!board) return;

  const numberElement = document.createElement("div");
  numberElement.textContent = num;
  board.appendChild(numberElement);

  const cellRect = cell.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  const offsetX = window.scrollX;
  const offsetY = window.scrollY;

  numberElement.style.position = "absolute";
  numberElement.style.left = `${cellRect.left - boardRect.left + offsetX}px`;
  numberElement.style.top = `${cellRect.top - boardRect.top + offsetY}px`;
  numberElement.style.transform = "scale(0.5)";

  requestAnimationFrame(() => {
    numberElement.style.transition = "transform 1s ease-in-out";

    const centerX = boardRect.width / 1.8 - cellRect.width / 2;
    const centerY = boardRect.height / 3.5 - cellRect.height / 2;

    numberElement.style.transform = `translate(${
      centerX - (cellRect.left - boardRect.left)
    }px, 
      ${centerY - (cellRect.top - boardRect.top)}px) scale(2)`;
  });

  setTimeout(() => {
    numberElement.style.transition = "none";
    numberElement.style.left = "50%";
    numberElement.style.top = "50%";
    numberElement.style.transform = "translate(-50%, -50%) scale(2)";
    numberElement.classList.add("animated-number");
    cell.style.background = "yellow";

    markNumberOnBoards(Number(num));

    setTimeout(() => {
      board.removeChild(numberElement);
    }, 800);

    setTimeout(() => {
      if (!gameEnd) callback();
    }, 800);
  }, 1000);
};

/** ✅ Marks the selected number on both grids */
const markNumberOnBoards = (num: number) => {
  let playerCells = document.querySelectorAll("#box1 .cell");
  let computerCells = document.querySelectorAll("#box2 .cell");

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (playerGrid[i][j] === num) {
        playerMarked[i][j] = true;
        let targetCell = playerCells[i * col + j];
        targetCell.style.background = "yellow";
        targetCell.classList.add("animated-number"); // ✅ Fix: Add class to correct cell
      }
      if (computerGrid[i][j] === num) {
        computerMarked[i][j] = true;
        let targetCell = computerCells[i * col + j];
        targetCell.style.background = "yellow";
        targetCell.classList.add("animated-number"); // ✅ Fix: Add class to correct cell
      }
    }
  }
  checkLine();
};

let markedLinesPlayer = 0; // Player's marked lines counter
let markedLinesComputer = 0; // Computer's marked lines counter
const maxLines = 5; // The game ends after 5 lines
let markedRowsPlayer: boolean[] = Array(row).fill(false); // Player's tracked rows
let markedColumnsPlayer: boolean[] = Array(col).fill(false); // Player's tracked columns
let markedDiagonalsPlayer: boolean[] = [false, false]; // Player's tracked diagonals
let markedRowsComputer: boolean[] = Array(row).fill(false); // Computer's tracked rows
let markedColumnsComputer: boolean[] = Array(col).fill(false); // Computer's tracked columns
let markedDiagonalsComputer: boolean[] = [false, false]; // Computer's tracked diagonals

/** ✅ Highlights BINGO letters in order as lines are marked */
const highlightBingoLetters = (
  lineType: string,
  index: number,
  player: boolean
) => {
  const bingoLetters = document.querySelectorAll(".b1 div");
  const bingoLettersComputer = document.querySelectorAll("#b2 div");

  let targetLetters = player ? bingoLetters : bingoLettersComputer;

  // Ensure only the letters corresponding to the line count are highlighted
  if (player) {
    switch (markedLinesPlayer) {
      case 0:
        targetLetters[0].style.backgroundColor = "yellow";
        targetLetters[0].classList.add("bingo-animate"); // Highlight 'B' for player
        break;
      case 1:
        targetLetters[1].style.backgroundColor = "yellow";
        targetLetters[1].classList.add("bingo-animate"); // Highlight 'I' for player
        break;
      case 2:
        targetLetters[2].style.backgroundColor = "yellow";
        targetLetters[2].classList.add("bingo-animate"); // Highlight 'N' for player
        break;
      case 3:
        targetLetters[3].style.backgroundColor = "yellow";
        targetLetters[3].classList.add("bingo-animate"); // Highlight 'G' for player
        break;
      case 4:
        targetLetters[4].style.backgroundColor = "yellow";
        targetLetters[4].classList.add("bingo-animate"); // Highlight 'O' for player
        break;
    }
  } else {
    switch (markedLinesComputer) {
      case 0:
        targetLetters[0].style.backgroundColor = "yellow";
        targetLetters[0].classList.add("bingo-animate"); // Highlight 'B' for computer
        break;
      case 1:
        targetLetters[1].style.backgroundColor = "yellow";
        targetLetters[1].classList.add("bingo-animate"); // Highlight 'I' for computer
        break;
      case 2:
        targetLetters[2].style.backgroundColor = "yellow";
        targetLetters[2].classList.add("bingo-animate"); // Highlight 'N' for computer
        break;
      case 3:
        targetLetters[3].style.backgroundColor = "yellow";
        targetLetters[3].classList.add("bingo-animate"); // Highlight 'G' for computer
        break;
      case 4:
        targetLetters[4].style.backgroundColor = "yellow";
        targetLetters[4].classList.add("bingo-animate"); // Highlight 'O' for computer
        break;
    }
  }
};

/** ✅ Checks for a bingo (row, column, or diagonal) */
const checkForLine = (grid: boolean[][], player: boolean): boolean => {
  const markedRows = player ? markedRowsPlayer : markedRowsComputer;
  const markedColumns = player ? markedColumnsPlayer : markedColumnsComputer;
  const markedDiagonals = player
    ? markedDiagonalsPlayer
    : markedDiagonalsComputer;

  // Check for rows
  for (let i = 0; i < row; i++) {
    if (grid[i].every((cell) => cell) && !markedRows[i]) {
      markedRows[i] = true; // Mark this row as counted
      highlightBingoLetters("row", i, player);
      if (player) markedLinesPlayer++;
      else markedLinesComputer++; // Increment the marked line counter
      return true;
    }
  }

  // Check for columns
  for (let j = 0; j < col; j++) {
    if (grid.every((row) => row[j]) && !markedColumns[j]) {
      markedColumns[j] = true; // Mark this column as counted
      highlightBingoLetters("column", j, player);
      if (player) markedLinesPlayer++;
      else markedLinesComputer++; // Increment the marked line counter
      return true;
    }
  }

  // Check for main diagonal
  if (grid.every((_, i) => grid[i][i]) && !markedDiagonals[0]) {
    markedDiagonals[0] = true; // Mark the main diagonal as counted
    highlightBingoLetters("diagonal", 0, player);
    if (player) markedLinesPlayer++;
    else markedLinesComputer++; // Increment the marked line counter
    return true;
  }

  // Check for anti-diagonal
  if (grid.every((_, i) => grid[i][col - i - 1]) && !markedDiagonals[1]) {
    markedDiagonals[1] = true; // Mark the anti-diagonal as counted
    highlightBingoLetters("diagonal", 4, player);
    if (player) markedLinesPlayer++;
    else markedLinesComputer++; // Increment the marked line counter
    return true;
  }

  return false;
};

let playerBingo = 0;
let computerBingo = 0;

const checkLine = () => {
  if (checkForLine(playerMarked, true)) {
    playerBingo++;
  }
  if (checkForLine(computerMarked, false)) {
    computerBingo++;
  }

  // End the game after 5 lines have been marked for either player or computer
  if (markedLinesPlayer === maxLines) {
    endGame("Player wins!");
  } else if (markedLinesComputer === maxLines) {
    endGame("Computer wins!");
  }
};

/** ✅ Ends the game */
const endGame = (message: string) => {
  gameEnd = true;
  const board = document.querySelector(".board");

  // Clear any existing content on the board
  board!.innerHTML = "";

  // Create the end message
  const endMessage = document.createElement("div");
  endMessage.textContent = message;
  endMessage.style.position = "absolute";
  endMessage.style.left = "50%";
  endMessage.style.top = "50%";
  endMessage.style.transform = "translate(-50%, -50%)";
  endMessage.style.fontSize = "24px"; // Adjust font size as needed
  endMessage.style.fontWeight = "bold"; // Optional, for better emphasis
  endMessage.style.textAlign = "center";

  // Append the end message to the board
  board!.appendChild(endMessage);
  board!.style.backgroundColor = "yellow";
  board!.style.lineHeight = "normal";
  document.querySelector(".reset")?.classList.remove("hidden");
  document.querySelector(".turn")?.classList.add("hidden");
  document.querySelector(".wait")?.classList.add("hidden");
};

/** ✅ Handles player number selection */
const setupPlayerTurn = () => {
  if (!playerTurn || gameEnd) return;
  document.querySelector(".turn")!.style.fontWeight = "900";
  document.querySelector(".wait")!.style.fontWeight = "100";
  document.querySelectorAll("#box1 .cell").forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (!playerTurn || gameEnd) return;

      const target = event.target as HTMLElement;
      const num = Number(target.textContent);
      if (!isNaN(num) && !usedNumbers.includes(num)) {
        usedNumbers.push(num);
        playerTurn = false;

        duplicateAndAnimate(target, num.toString(), () => {
          if (!gameEnd) setTimeout(computerNumChoose, 100);
        });
      }
    });
  });
};

/** ✅ Handles computer's number selection */
const computerNumChoose = () => {
  if (gameEnd) return;
  document.querySelector(".turn")!.style.fontWeight = "100";
  document.querySelector(".wait")!.style.fontWeight = "900";

  let num: number;
  do {
    num = Math.floor(Math.random() * 25 + 1);
  } while (usedNumbers.includes(num));

  usedNumbers.push(num);

  const cells = document.querySelectorAll("#box2 .cell");
  for (const cell of cells) {
    if (cell.textContent?.trim() === String(num)) {
      duplicateAndAnimate(cell as HTMLElement, num.toString(), () => {
        if (!gameEnd) {
          playerTurn = true;
          setupPlayerTurn();
        }
      });
      break;
    }
  }
};

/** ✅ Start button event listener */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".start")?.addEventListener("click", generate);
});

document.querySelector(".reset")?.addEventListener("click", resetGame);

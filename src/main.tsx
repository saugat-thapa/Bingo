import "./container.css";
import "./box.css";
import "./misc.css";

const row = 5;
const col = 5;

let usedNumbers: number[] = [];
let gameEnd = false;
let playerTurn = true;

let playerGrid: number[][] = [];
let computerGrid: number[][] = [];

//empty grids
let playerMarked: boolean[][] = Array.from({ length: row }, () =>
  Array(col).fill(false)
);
let computerMarked: boolean[][] = Array.from({ length: row }, () =>
  Array(col).fill(false)
);

const emptyGrid = (boxNumber: number) => {
  const container = document.querySelector(`#box${boxNumber}`);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.textContent = "";
      container.appendChild(cell);
    }
  }
};

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

const land = () => {
  emptyGrid(1);
  emptyGrid(2);
};
land();

const generate = () => {
  usedNumbers = [];
  playerTurn = true;
  gameEnd = false;

  playerGrid = createCards();
  computerGrid = createCards();

  //mark tracking
  playerMarked = Array.from({ length: row }, () => Array(col).fill(false));
  computerMarked = Array.from({ length: row }, () => Array(col).fill(false));

  createGrid(playerGrid, 1);
  createGrid(computerGrid, 2);

  document.querySelector(".start")?.classList.add("hidden");
  (document.querySelector(".board") as HTMLElement)!.innerText = "";
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

  //reset win condition
  markedRowsPlayer.fill(false);
  markedColumnsPlayer.fill(false);
  markedDiagonalsPlayer.fill(false);
  markedRowsComputer.fill(false);
  markedColumnsComputer.fill(false);
  markedDiagonalsComputer.fill(false);

  const board = document.querySelector(".board") as HTMLElement;
  board.innerHTML = "BINGO";
  board.style.lineHeight = "90px";
  board.style.backgroundColor = "white";

  document.querySelectorAll(".cell").forEach((cell) => {
    (cell as HTMLElement).style.backgroundColor = "white";
  });

  document.querySelectorAll(".b1 div, #b2 div").forEach((letter) => {
    (letter as HTMLElement).style.backgroundColor = "white";
    letter.classList.remove("bingo-animate");
  });

  land();

  document.querySelector(".start")?.classList.remove("hidden");
  document.querySelector(".reset")?.classList.add("hidden");
};

const numAnimate = (cell: HTMLElement, num: string, callback: () => void) => {
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

const markNumberOnBoards = (num: number) => {
  let playerCells = document.querySelectorAll("#box1 .cell");
  let computerCells = document.querySelectorAll("#box2 .cell");

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (playerGrid[i][j] === num) {
        playerMarked[i][j] = true;

        let targetCell = playerCells[i * col + j] as HTMLElement;
        targetCell.style.background = "yellow";
        targetCell.classList.add("animated-number");
      }
      if (computerGrid[i][j] === num) {
        computerMarked[i][j] = true;
        let targetCell = computerCells[i * col + j] as HTMLElement;
        targetCell.style.background = "yellow";
        targetCell.classList.add("animated-number");
      }
    }
  }
  checkLine();
};

let markedLinesPlayer = 0;
let markedLinesComputer = 0;
const maxLines = 5;
let markedRowsPlayer: boolean[] = Array(row).fill(false);
let markedColumnsPlayer: boolean[] = Array(col).fill(false);
let markedDiagonalsPlayer: boolean[] = [false, false];
let markedRowsComputer: boolean[] = Array(row).fill(false);
let markedColumnsComputer: boolean[] = Array(col).fill(false);
let markedDiagonalsComputer: boolean[] = [false, false];

const highlightBingoLetters = (player: boolean) => {
  const bingoLetters = document.querySelectorAll(".b1 div");
  const bingoLettersComputer = document.querySelectorAll("#b2 div");

  const targetLetters = Array.from(
    player ? bingoLetters : bingoLettersComputer
  ) as HTMLElement[];

  if (player) {
    switch (markedLinesPlayer) {
      case 0:
        targetLetters[0].style.backgroundColor = "yellow";
        targetLetters[0].classList.add("bingo-animate");
        break;
      case 1:
        targetLetters[1].style.backgroundColor = "yellow";
        targetLetters[1].classList.add("bingo-animate");
        break;
      case 2:
        targetLetters[2].style.backgroundColor = "yellow";
        targetLetters[2].classList.add("bingo-animate");
        break;
      case 3:
        targetLetters[3].style.backgroundColor = "yellow";
        targetLetters[3].classList.add("bingo-animate");
        break;
      case 4:
        targetLetters[4].style.backgroundColor = "yellow";
        targetLetters[4].classList.add("bingo-animate");
        break;
    }
  } else {
    switch (markedLinesComputer) {
      case 0:
        targetLetters[0].style.backgroundColor = "yellow";
        targetLetters[0].classList.add("bingo-animate");
        break;
      case 1:
        targetLetters[1].style.backgroundColor = "yellow";
        targetLetters[1].classList.add("bingo-animate");
        break;
      case 2:
        targetLetters[2].style.backgroundColor = "yellow";
        targetLetters[2].classList.add("bingo-animate");
        break;
      case 3:
        targetLetters[3].style.backgroundColor = "yellow";
        targetLetters[3].classList.add("bingo-animate");
        break;
      case 4:
        targetLetters[4].style.backgroundColor = "yellow";
        targetLetters[4].classList.add("bingo-animate");
        break;
    }
  }
};

const checkForLine = (grid: boolean[][], player: boolean): boolean => {
  const markedRows = player ? markedRowsPlayer : markedRowsComputer;
  const markedColumns = player ? markedColumnsPlayer : markedColumnsComputer;
  const markedDiagonals = player
    ? markedDiagonalsPlayer
    : markedDiagonalsComputer;

  for (let i = 0; i < row; i++) {
    if (grid[i].every((cell) => cell) && !markedRows[i]) {
      markedRows[i] = true;
      highlightBingoLetters(player);
      if (player) markedLinesPlayer++;
      else markedLinesComputer++;
      return true;
    }
  }

  for (let j = 0; j < col; j++) {
    if (grid.every((row) => row[j]) && !markedColumns[j]) {
      markedColumns[j] = true;
      highlightBingoLetters(player);
      if (player) markedLinesPlayer++;
      else markedLinesComputer++;
      return true;
    }
  }

  if (grid.every((_, i) => grid[i][i]) && !markedDiagonals[0]) {
    markedDiagonals[0] = true;
    highlightBingoLetters(player);
    if (player) markedLinesPlayer++;
    else markedLinesComputer++;
    return true;
  }

  if (grid.every((_, i) => grid[i][col - i - 1]) && !markedDiagonals[1]) {
    markedDiagonals[1] = true;
    highlightBingoLetters(player);
    if (player) markedLinesPlayer++;
    else markedLinesComputer++;
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

  if (markedLinesPlayer === maxLines) {
    endGame("Player wins!");
  } else if (markedLinesComputer === maxLines) {
    endGame("Computer wins!");
  }
};

const endGame = (message: string) => {
  gameEnd = true;
  const board = document.querySelector(".board") as HTMLElement;

  board!.innerHTML = "";

  const endMessage = document.createElement("div");
  endMessage.textContent = message;
  endMessage.style.position = "absolute";
  endMessage.style.left = "50%";
  endMessage.style.top = "50%";
  endMessage.style.transform = "translate(-50%, -50%)";
  endMessage.style.fontSize = "24px";
  endMessage.style.fontWeight = "bold";
  endMessage.style.textAlign = "center";

  board!.appendChild(endMessage);
  board!.style.backgroundColor = "yellow";
  board!.style.lineHeight = "normal";
  document.querySelector(".reset")?.classList.remove("hidden");
  document.querySelector(".turn")?.classList.add("hidden");
  document.querySelector(".wait")?.classList.add("hidden");
};

const setupPlayerTurn = () => {
  if (!playerTurn || gameEnd) return;
  (document.querySelector(".turn") as HTMLElement)!.style.fontWeight = "900";
  (document.querySelector(".wait") as HTMLElement)!.style.fontWeight = "100";
  document.querySelectorAll("#box1 .cell").forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (!playerTurn || gameEnd) return;

      const target = event.target as HTMLElement;
      const num = Number(target.textContent);
      if (!isNaN(num) && !usedNumbers.includes(num)) {
        usedNumbers.push(num);
        playerTurn = false;

        numAnimate(target, num.toString(), () => {
          if (!gameEnd) setTimeout(computerNumChoose, 100);
        });
      }
    });
  });
};

const computerNumChoose = () => {
  if (gameEnd) return;
  (document.querySelector(".turn") as HTMLElement)!.style.fontWeight = "100";
  (document.querySelector(".wait") as HTMLElement)!.style.fontWeight = "900";

  let num: number;
  do {
    num = Math.floor(Math.random() * 25 + 1);
  } while (usedNumbers.includes(num));

  usedNumbers.push(num);

  const cells = document.querySelectorAll("#box2 .cell");
  for (const cell of cells) {
    if (cell.textContent?.trim() === String(num)) {
      numAnimate(cell as HTMLElement, num.toString(), () => {
        if (!gameEnd) {
          playerTurn = true;
          setupPlayerTurn();
        }
      });
      break;
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".start")?.addEventListener("click", generate);
});

document.querySelector(".reset")?.addEventListener("click", resetGame);

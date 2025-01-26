import { numAnimate } from "./ui.js";

let playerTurn = true;
let gameEnd = false;
let usedNumbers = [];

export const setupPlayerTurn = () => {
  if (!playerTurn || gameEnd) return;

  document.querySelectorAll("#box1 .cell").forEach((cell) => {
    cell.addEventListener("click", (event) => {
      if (!playerTurn || gameEnd) return;

      const target = event.target;
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

export const computerNumChoose = () => {
  if (gameEnd) return;

  let num;
  do {
    num = Math.floor(Math.random() * 25) + 1;
  } while (usedNumbers.includes(num));

  usedNumbers.push(num);

  const cells = document.querySelectorAll("#box2 .cell");
  for (const cell of cells) {
    if (cell.textContent?.trim() === String(num)) {
      numAnimate(cell, num.toString(), () => {
        if (!gameEnd) {
          playerTurn = true;
          setupPlayerTurn();
        }
      });
      break;
    }
  }
};

import { createCards, createGrid } from "./grid.js";
import { numAnimate, highlightBingoLetters, endGame } from "./ui.js";
import { setupPlayerTurn } from "./eventHandlers.js";

const row = 5;
const col = 5;
let usedNumbers = [];
let gameEnd = false;
let playerTurn = true;
let playerGrid = [];
let computerGrid = [];
let playerMarked = Array.from({ length: row }, () => Array(col).fill(false));
let computerMarked = Array.from({ length: row }, () => Array(col).fill(false));

export const generate = () => {
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

export const resetGame = () => {
  usedNumbers = [];
  gameEnd = false;
  playerTurn = true;

  playerGrid = [];
  computerGrid = [];

  playerMarked = Array.from({ length: row }, () => Array(col).fill(false));
  computerMarked = Array.from({ length: row }, () => Array(col).fill(false));

  document.querySelector(".board").innerHTML = "BINGO";
  document
    .querySelectorAll(".cell")
    .forEach((cell) => (cell.style.backgroundColor = "white"));

  document.querySelector(".start")?.classList.remove("hidden");
  document.querySelector(".reset")?.classList.add("hidden");
};

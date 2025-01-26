import { createGrid, emptyGrid } from "./grid.js";
import { generate, resetGame, setupPlayerTurn } from "./gameLogic.js";
import "./index.css";
import "./container.css";
import "./box.css";
import "./misc.css";

// Create empty grids on page load
document.addEventListener("DOMContentLoaded", () => {
  emptyGrid(1);
  emptyGrid(2);
  document.querySelector(".start")?.addEventListener("click", generate);
  document.querySelector(".reset")?.addEventListener("click", resetGame);
});

export const numAnimate = (cell, num, callback) => {
  const board = document.querySelector(".board");
  if (!board) return;

  const numberElement = document.createElement("div");
  numberElement.textContent = num;
  board.appendChild(numberElement);

  requestAnimationFrame(() => {
    numberElement.style.transition = "transform 1s ease-in-out";
    numberElement.style.transform = "scale(2)";
  });

  setTimeout(() => {
    board.removeChild(numberElement);
    cell.style.background = "yellow";
    callback();
  }, 1000);
};

export const highlightBingoLetters = (player, markedLines) => {
  const bingoLetters = player
    ? document.querySelectorAll(".b1 div")
    : document.querySelectorAll("#b2 div");
  if (markedLines < bingoLetters.length) {
    bingoLetters[markedLines].style.backgroundColor = "yellow";
    bingoLetters[markedLines].classList.add("bingo-animate");
  }
};

export const endGame = (message) => {
  const board = document.querySelector(".board");
  board.innerHTML = `<div style="font-size: 24px; font-weight: bold;">${message}</div>`;
  document.querySelector(".reset")?.classList.remove("hidden");
  document.querySelector(".turn")?.classList.add("hidden");
  document.querySelector(".wait")?.classList.add("hidden");
};

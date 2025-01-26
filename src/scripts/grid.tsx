const row = 5;
const col = 5;

// Empty grid creation
export const emptyGrid = (boxNumber) => {
  const container = document.querySelector(`#box${boxNumber}`);
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      container.appendChild(cell);
    }
  }
};

// Generate unique bingo numbers
export const createCards = () => {
  const usedNumbers = new Set();
  while (usedNumbers.size < 25) {
    usedNumbers.add(Math.floor(Math.random() * 25) + 1);
  }

  const cardNumbers = Array.from(usedNumbers);
  return Array.from({ length: row }, (_, i) =>
    cardNumbers.slice(i * col, (i + 1) * col)
  );
};

// Render grid with numbers
export const createGrid = (cardNumbers, boxNumber) => {
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

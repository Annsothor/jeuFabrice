const grid = document.getElementById('grid');
const size = 5;
let last = null;
let checked = new Set();
let cells = [];

initGrid();

function initGrid() {
  grid.innerHTML = '';
  cells = [];
  checked = new Set();
  last = null;

  const msg = document.getElementById('message');
  msg.classList.add('hidden');
  msg.textContent = '';

  // Génération de la grille
  for (let i = 0; i < size; i++) {
    cells[i] = [];
    for (let j = 0; j < size; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', handleClick);
      grid.appendChild(cell);
      cells[i][j] = cell;
    }
  }
}

function handleClick(e) {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const key = `${row},${col}`;

  if (checked.has(key)) return;

  // première case
  if (!last) {
    checkCell(cell, key);
    updateClickableCells();
    return;
  }

  const [lr, lc] = last.split(',').map(Number);
  const dr = Math.abs(row - lr);
  const dc = Math.abs(col - lc);
  const validMove =
    ((dr === 3 && dc === 0) || // vertical
     (dr === 0 && dc === 3) || // horizontal
     (dr === 2 && dc === 2));  // diagonal

  if (validMove) {
    checkCell(cell, key);
    updateClickableCells();
  } else {
    cell.classList.add('illegal');
    setTimeout(() => cell.classList.remove('illegal'), 300);
  }
}

function checkCell(cell, key) {
  cell.classList.add('checked');
  cell.classList.remove('current');
  checked.add(key);
  last = key;

  const [r, c] = key.split(',').map(Number);
  cells[r][c].classList.add('current');

  updateClickableCells();

  // Victoire complète
  if (checked.size === size * size) {
    showMessage(`🎉 Bravo ! Vous avez coché ${checked.size} cases !`);
    return;
  }

  // Fin de partie : plus aucun coup possible
  const remainingMoves = document.querySelectorAll('.clickable').length;
  if (remainingMoves === 0) {
    showMessage(`👏 Bravo ! Vous avez coché ${checked.size} cases. Mais vous pouvez faire mieux !`);
  }
}

function updateClickableCells() {
  document.querySelectorAll('.clickable').forEach(el => el.classList.remove('clickable'));

  if (!last) return;

  const [r, c] = last.split(',').map(Number);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const dr = Math.abs(i - r);
      const dc = Math.abs(j - c);
      const key = `${i},${j}`;
      const validMove =
        ((dr === 3 && dc === 0) || (dr === 0 && dc === 3) || (dr === 2 && dc === 2));

      if (validMove && !checked.has(key)) {
        cells[i][j].classList.add('clickable');
      }
    }
  }
}

function showMessage(text) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.classList.remove('hidden');
}

// 🔄 Bouton reset
document.getElementById('reset').addEventListener('click', () => {
  initGrid();
});

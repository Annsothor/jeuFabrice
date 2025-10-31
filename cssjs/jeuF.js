// Sélectionne la grille dans le HTML
const grid = document.getElementById('grid');

// Taille de la grille (5x5)
const size = 5;

// Variables de jeu
let last = null;         // dernière case cochée
let checked = new Set(); // ensemble des cases déjà cochées
let cells = [];          // tableau contenant toutes les cellules
let moveCount = 0;       // compteur de clics valides (1, 2, 3, ...)

// Initialisation de la grille au chargement
initGrid();

function initGrid() {
  // Vide la grille du HTML
  grid.innerHTML = '';

  // Réinitialise toutes les variables du jeu
  cells = [];
  checked = new Set();
  last = null;
  moveCount = 0;

  // Réinitialise le message
  const msg = document.getElementById('message');
  msg.classList.add('hidden');
  msg.textContent = '';

  // Génération de la grille (5x5)
  for (let i = 0; i < size; i++) {
    cells[i] = [];
    for (let j = 0; j < size; j++) {
      // Création d’une case (div)
      const cell = document.createElement('div');
      cell.className = 'cell';         // ajout d’une classe CSS
      cell.dataset.row = i;            // sauvegarde la ligne dans data-row
      cell.dataset.col = j;            // sauvegarde la colonne dans data-col
      cell.addEventListener('click', handleClick); // ajoute l’écouteur de clic
      grid.appendChild(cell);          // insère la case dans la grille
      cells[i][j] = cell;              // stocke la case dans le tableau
    }
  }
}

function handleClick(e) {
  // Récupère la case cliquée
  const cell = e.target;
  const row = parseInt(cell.dataset.row); // ligne de la case
  const col = parseInt(cell.dataset.col); // colonne de la case
  const key = `${row},${col}`;            // identifiant unique de la case

  // Si la case est déjà cochée, on ignore le clic
  if (checked.has(key)) return;

  // Si c’est le premier clic, on coche directement la case
  if (!last) {
    checkCell(cell, key);
    updateClickableCells();
    return;
  }

  // Sinon, on calcule la distance entre la dernière case cochée et celle cliquée
  const [lr, lc] = last.split(',').map(Number);
  const dr = Math.abs(row - lr); // distance verticale
  const dc = Math.abs(col - lc); // distance horizontale

  // Vérifie si le mouvement est valide :
  // - 3 cases d’écart horizontalement ou verticalement
  // - 2 cases d’écart diagonalement
  const validMove =
    ((dr === 3 && dc === 0) || // vertical
     (dr === 0 && dc === 3) || // horizontal
     (dr === 2 && dc === 2));  // diagonal

  // Si le coup est valide → coche la case
  if (validMove) {
    checkCell(cell, key);
    updateClickableCells();
  } else {
    // Si le coup est invalide → animation d’erreur
    cell.classList.add('illegal');
    setTimeout(() => cell.classList.remove('illegal'), 300);
  }
}

function checkCell(cell, key) {
  // Incrémente le compteur de coups valides
  moveCount++;

  // Affiche le numéro dans la case (1, 2, 3, ...)
  cell.textContent = moveCount;

  // Marque la case comme cochée
  cell.classList.add('checked');
  cell.classList.remove('current');

  // Ajoute la case aux cases cochées
  checked.add(key);

  // Met à jour la dernière case cochée
  last = key;

  // Ajoute la classe "current" à la case actuelle
  const [r, c] = key.split(',').map(Number);
  cells[r][c].classList.add('current');

  // Met à jour les cases cliquables autour
  updateClickableCells();

  // Si toutes les cases sont cochées → victoire
  if (checked.size === size * size) {
    showMessage(`🎉 Bravo ! Vous avez coché ${checked.size} cases !`);
    return;
  }

  // Sinon, si aucune case cliquable n’est disponible → fin de partie
  const remainingMoves = document.querySelectorAll('.clickable').length;
  if (remainingMoves === 0) {
    showMessage(`👏 Bravo ! Vous avez coché ${checked.size} cases. Mais vous pouvez faire mieux !`);
  }
}

function updateClickableCells() {
  // Supprime toutes les anciennes indications de cases cliquables
  document.querySelectorAll('.clickable').forEach(el => el.classList.remove('clickable'));

  // Si aucune case n’a encore été cochée, on arrête là
  if (!last) return;

  // Coordonnées de la dernière case cochée
  const [r, c] = last.split(',').map(Number);

  // Parcourt toute la grille pour trouver les cases accessibles
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const dr = Math.abs(i - r);
      const dc = Math.abs(j - c);
      const key = `${i},${j}`;

      // Vérifie si la case est un coup valide
      const validMove =
        ((dr === 3 && dc === 0) || (dr === 0 && dc === 3) || (dr === 2 && dc === 2));

      // Si c’est un coup valide et non encore coché → indique la case comme cliquable
      if (validMove && !checked.has(key)) {
        cells[i][j].classList.add('clickable');
      }
    }
  }
}

// Affiche un message (victoire ou fin de partie)
function showMessage(text) {
  const msg = document.getElementById('message');
  msg.textContent = text;
  msg.classList.remove('hidden');
}

// 🔄 Bouton reset : réinitialise complètement le jeu
document.getElementById('reset').addEventListener('click', () => {
  initGrid();
});

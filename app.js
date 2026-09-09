const COLS = 10;
const ROWS = 20;
const CELL = 30;
const COLORS = ['#50e3c2', '#6c8cff', '#ff9f43', '#f7d354', '#79d85b', '#c084fc', '#ff6b7a'];
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]]
];

const boardCanvas = document.querySelector('#board');
const nextCanvas = document.querySelector('#next');
const boardContext = boardCanvas.getContext('2d');
const nextContext = nextCanvas.getContext('2d');
const scoreElement = document.querySelector('#score');
const linesElement = document.querySelector('#lines');
const levelElement = document.querySelector('#level');
const statusElement = document.querySelector('#status');
const languageToggle = document.querySelector('#language-toggle');
const translations = {
  es: { newGame: 'Nueva partida', nextPiece: 'Siguiente pieza', score: 'Puntuación', lines: 'Líneas', level: 'Nivel', move: 'mover', drop: 'acelerar', rotate: 'rotar', pause: 'pausa', gameOver: 'FIN DE LA PARTIDA', paused: 'PAUSA', gameAreaLabel: 'Juego de Tetris', boardLabel: 'Tablero de Tetris', nextLabel: 'Vista previa de la siguiente pieza', touchControls: 'Controles táctiles', left: 'Mover a la izquierda', right: 'Mover a la derecha', down: 'Bajar pieza', languageLabel: 'Cambiar a inglés', footerRole: 'Fullstack Developer', footerSocials: 'Redes sociales', whatsapp: 'WhatsApp', github: 'GitHub', linkedin: 'LinkedIn', email: 'Correo electrónico', copyright: '© 2026 Juan Carlos. Todos los derechos reservados.', builtWith: 'Hecho con JavaScript y CSS' },
  en: { newGame: 'New game', nextPiece: 'Next piece', score: 'Score', lines: 'Lines', level: 'Level', move: 'move', drop: 'drop', rotate: 'rotate', pause: 'pause', gameOver: 'GAME OVER', paused: 'PAUSED', gameAreaLabel: 'Tetris game', boardLabel: 'Tetris board', nextLabel: 'Next piece preview', touchControls: 'Touch controls', left: 'Move left', right: 'Move right', down: 'Drop piece', languageLabel: 'Cambiar a español', footerRole: 'Fullstack Developer', footerSocials: 'Social media', whatsapp: 'WhatsApp', github: 'GitHub', linkedin: 'LinkedIn', email: 'Email', copyright: '© 2026 Juan Carlos. All rights reserved.', builtWith: 'Built with JavaScript and CSS' }
};
let language = 'es';
let board;
let current;
let next;
let score;
let lines;
let level;
let paused;
let gameOver;
let dropTimer;
let lastDrop;

function cloneShape(shape) {
  return shape.map(row => [...row]);
}

function createPiece() {
  const index = Math.floor(Math.random() * SHAPES.length);
  const shape = cloneShape(SHAPES[index]);
  return { shape, color: COLORS[index], x: Math.floor((COLS - shape[0].length) / 2), y: 0 };
}

function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  current = createPiece();
  next = createPiece();
  score = 0;
  lines = 0;
  level = 1;
  paused = false;
  gameOver = false;
  lastDrop = performance.now();
  statusElement.classList.remove('visible');
  updateStats();
  draw();
  cancelAnimationFrame(dropTimer);
  dropTimer = requestAnimationFrame(gameLoop);
}

function initializeGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  current = null;
  next = null;
  score = 0;
  lines = 0;
  level = 1;
  paused = false;
  gameOver = true;
  updateStats();
  draw();
}

function collides(piece, offsetX = piece.x, offsetY = piece.y, shape = piece.shape) {
  return shape.some((row, rowIndex) => row.some((cell, columnIndex) => {
    if (!cell) return false;
    const x = offsetX + columnIndex;
    const y = offsetY + rowIndex;
    return x < 0 || x >= COLS || y >= ROWS || (y >= 0 && board[y][x]);
  }));
}

function rotate(shape) {
  return shape[0].map((_, column) => shape.map(row => row[column]).reverse());
}

function move(horizontal) {
  if (!paused && !gameOver && !collides(current, current.x + horizontal)) current.x += horizontal;
}

function rotateCurrent() {
  if (paused || gameOver) return;
  const rotated = rotate(current.shape);
  const kicks = [0, -1, 1, -2, 2];
  const kick = kicks.find(offset => !collides(current, current.x + offset, current.y, rotated));
  if (kick !== undefined) {
    current.x += kick;
    current.shape = rotated;
  }
}

function drop() {
  if (paused || gameOver) return;
  if (!collides(current, current.x, current.y + 1)) current.y++;
  else lockPiece();
}

function lockPiece() {
  current.shape.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
    if (cell && current.y + rowIndex >= 0) board[current.y + rowIndex][current.x + columnIndex] = current.color;
  }));
  clearLines();
  current = next;
  next = createPiece();
  if (collides(current)) {
    gameOver = true;
    statusElement.textContent = translations[language].gameOver;
    statusElement.classList.add('visible');
  }
}

function clearLines() {
  const remaining = board.filter(row => row.some(cell => !cell));
  const cleared = ROWS - remaining.length;
  if (!cleared) return;
  while (remaining.length < ROWS) remaining.unshift(Array(COLS).fill(null));
  board = remaining;
  lines += cleared;
  score += [0, 100, 300, 500, 800][cleared] * level;
  level = Math.floor(lines / 10) + 1;
  updateStats();
}

function updateStats() {
  scoreElement.textContent = score;
  linesElement.textContent = lines;
  levelElement.textContent = level;
}

function drawCell(context, x, y, color, size = CELL) {
  context.fillStyle = color;
  context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
  context.fillStyle = 'rgba(255,255,255,.16)';
  context.fillRect(x * size + 3, y * size + 3, size - 6, 3);
}

function draw() {
  boardContext.fillStyle = '#090f0d';
  boardContext.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
  boardContext.strokeStyle = 'rgba(145,160,154,.13)';
  boardContext.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) { boardContext.beginPath(); boardContext.moveTo(x * CELL, 0); boardContext.lineTo(x * CELL, ROWS * CELL); boardContext.stroke(); }
  for (let y = 0; y <= ROWS; y++) { boardContext.beginPath(); boardContext.moveTo(0, y * CELL); boardContext.lineTo(COLS * CELL, y * CELL); boardContext.stroke(); }
  board.forEach((row, y) => row.forEach((color, x) => color && drawCell(boardContext, x, y, color)));
  if (current) current.shape.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => cell && drawCell(boardContext, current.x + columnIndex, current.y + rowIndex, current.color)));

  nextContext.fillStyle = '#090f0d';
  nextContext.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  const size = 24;
  if (next) {
    const offsetX = (5 - next.shape[0].length) / 2;
    const offsetY = (5 - next.shape.length) / 2;
    next.shape.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => cell && drawCell(nextContext, offsetX + columnIndex, offsetY + rowIndex, next.color, size)));
  }
}

function gameLoop(timestamp) {
  const speed = Math.max(90, 650 - (level - 1) * 55);
  if (!paused && !gameOver && timestamp - lastDrop > speed) { drop(); lastDrop = timestamp; }
  draw();
  dropTimer = requestAnimationFrame(gameLoop);
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  statusElement.textContent = paused ? translations[language].paused : '';
  statusElement.classList.toggle('visible', paused);
}

document.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(event.key)) event.preventDefault();
  if (event.key === 'ArrowLeft') move(-1);
  if (event.key === 'ArrowRight') move(1);
  if (event.key === 'ArrowDown') drop();
  if (event.key === 'ArrowUp') rotateCurrent();
  if (event.key.toLowerCase() === 'p' || event.key === ' ') togglePause();
});
document.querySelector('#restart').addEventListener('click', resetGame);
languageToggle.addEventListener('click', () => {
  language = language === 'es' ? 'en' : 'es';
  const text = translations[language];
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text[element.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-attr]').forEach(element => {
    element.dataset.i18nAttr.split(',').forEach(entry => {
      const [attribute, key] = entry.split(':');
      element.setAttribute(attribute, text[key]);
    });
  });
  languageToggle.textContent = language === 'es' ? 'EN' : 'ES';
  languageToggle.setAttribute('aria-label', text.languageLabel);
  if (gameOver && statusElement.classList.contains('visible')) statusElement.textContent = text.gameOver;
});
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  if (action === 'left') move(-1);
  if (action === 'right') move(1);
  if (action === 'down') drop();
  if (action === 'rotate') rotateCurrent();
}));

initializeGame();

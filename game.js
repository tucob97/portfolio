// guess the number

const secretNumber = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
  const input = document.getElementById("guessInput");
  const feedback = document.getElementById("feedback");
  const guess = parseInt(input.value);

  if (isNaN(guess)) {
    feedback.textContent = "Please enter a number.";
  } else if (guess < secretNumber) {
    feedback.textContent = "Too low. Try again!";
  } else if (guess > secretNumber) {
    feedback.textContent = "Too high. Try again!";
  } else {
    feedback.textContent = "🎉 You guessed it! Well done!";
  }

  input.value = "";
}


// tic tac toe
const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
let cells = [];

function init() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('click', () => handlePlayerMove(i), { once: true });
    board.appendChild(cell);
    cells.push(cell);
  }

  status.textContent = "Player Turn: X";
  board.style.pointerEvents = "auto";
}

function disableBoard() {
    cells.forEach(cell => {
      cell.style.pointerEvents = "none";  // Disable interaction
    });
  }
  
  function enableBoard() {
    cells.forEach(cell => {
      cell.style.pointerEvents = "auto";  // Enable interaction
    });
  }


function handlePlayerMove(index) {
  if (cells[index].textContent === "" && !isGameOver()) {
    cells[index].textContent = "X";
    status.textContent = "Player Turn: O (CPU)";
    disableBoard(); // Disable board during CPU's turn
    if (!checkWinner("X")) {
      setTimeout(makeBestMove, 500);
    }
  }
}

function makeBestMove() {
  const best = minimax(getBoardState(), true);
  if (best.index !== undefined && !isGameOver()) {
    cells[best.index].textContent = "O";
    checkWinner("O");
    if (!isGameOver()) {
      status.textContent = "Player Turn: X";
    }
    enableBoard();  // Re-enable board after CPU move
  }
}

function getBoardState() {
  return cells.map(cell => cell.textContent || "");
}

function isGameOver() {
  return status.textContent.includes("wins") || status.textContent === "It's a draw!";
}

function checkWinner(player) {
  const b = getBoardState();
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  const won = wins.some(pattern => pattern.every(i => b[i] === player));

  if (won) {
    status.textContent = `${player} wins!`;
    board.style.pointerEvents = "none";
    return true;
  }

  if (b.every(cell => cell !== "")) {
    status.textContent = "It's a draw!";
    return true;
  }

  return false;
}

function minimax(board, isMaximizing) {
  const empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  if (checkWin(board, "X")) return { score: -10 };
  if (checkWin(board, "O")) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  const moves = [];

  for (let i of empty) {
    const move = { index: i };
    board[i] = isMaximizing ? "O" : "X";

    const result = minimax(board, !isMaximizing);
    move.score = result.score;
    board[i] = "";

    moves.push(move);
  }

  return isMaximizing
    ? moves.reduce((a, b) => (a.score > b.score ? a : b))
    : moves.reduce((a, b) => (a.score < b.score ? a : b));
}

function checkWin(board, player) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return wins.some(p => p.every(i => board[i] === player));
}

restartBtn.addEventListener('click', init);

// Start the game
init();



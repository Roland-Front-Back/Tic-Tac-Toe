// GameBoard function factory
function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 3x3 grid using 2d array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // return the current board state
  const getBoard = () => board;

  // Place player mark if cell is empty
  const placeMark = (row, column, playerMark) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addPlayerMark(playerMark);
    }
  };

  return { getBoard, placeMark };
}

// Cell function factory
// handles cell values
function Cell() {
  let value = "";

  // add player mark to change the cell value if empty
  const addPlayerMark = (playerMark) => {
    if (value === "") {
      value = playerMark;
    }
  };

  const getValue = () => value;

  return {
    addPlayerMark,
    getValue,
  };
}

// GameController function factory
// Handles flow and state of the game's logic
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = GameBoard();

  const players = [
    { name: playerOneName, mark: "X" },
    { name: playerTwoName, mark: "O" },
  ];

  let activePlayer = players[0];
  let isWinner = false;
  let isTie = false;

  const getBoard = board.getBoard;
  const getIsWinner = () => isWinner;
  const getIsTie = () => isTie;
  const getActivePlayer = () => activePlayer; // retrieve active player

  // Switches turn to other player
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  // Flatten the board to 1d arr. of values
  const getFlatBoard = () => {
    board
      .getBoard()
      .flat()
      .map((cell) => cell.getValue());
  };

  // Checks if current player has a winning patter
  const checkWinner = (playerMark) => {
    const winPattern = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const boardFlat = getBoard();

    // returns if player mark === to winpattern
    return winPattern.some((pattern) =>
      pattern.every((index) => boardFlat[index] === playerMark)
    );
  };

  // Checks if all cells are filled => draw
  const checkTie = () => {
    return getFlatBoard().every((mark) => mark !== "");
  };

  // Process a player move
  const playRound = (row, column) => {
    if (isWinner || isTie) return;

    // Only play if cell is empty
    if (board.getBoard()[row][column].getValue() !== "") return;

    board.placeMark(row, column, activePlayer.mark);

    if (checkWinner(activePlayer.mark)) {
      isWinner = true;
    } else if (checkTie()) {
      isTie = true;
    } else {
      switchPlayerTurn(); // no win or tie => continue game
    }
  };

  return {
    playRound,
    getBoard,
    getActivePlayer,
    getIsWinner,
    getIsTie,
  };
}

// ScreenController function factory
// Handles UI layer
function ScreenController(playerOne, playerTwo) {
  const game = GameController(playerOne, playerTwo);
  const gameStatus = document.querySelector(".gamestatus");
  const gameBoardDiv = document.querySelector("#gameboard");
  const restartBtn = document.querySelector("#restart-btn");

  restartBtn.addEventListener("click", () => {
    ScreenController(players.playerOne, players.playerTwo); // re-initialize controller
  });

  // Renders the board and update screen turn/status
  const updateScreen = () => {
    gameBoardDiv.textContent = "";

    // Gets game state and player data
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const winner = game.getIsWinner();
    const tie = game.getIsTie();

    // Display text message
    if (!winner && !tie) {
      gameStatus.textContent = `${activePlayer.name}'s turn...`;
    } else if (winner) {
      gameStatus.textContent = `${activePlayer.name}'s WINS`;
    } else if (tie) {
      gameStatus.textContent = `It's a TIE!`;
    }

    // Dynamically build the 3x3 grid in the html with buttons
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.classList.add("cell");
        cellBtn.dataset.row = rowIndex;
        cellBtn.dataset.column = colIndex;
        cellBtn.textContent = cell.getValue();
        gameBoardDiv.appendChild(cellBtn);
      });
    });
  };

  // Handles player clicks
  function clickHandler(event) {
    if (!event.target.classList.contains("cell")) return; // ignore click outside cells

    // stop game if someone has already won or it's a tie
    if (game.getIsWinner() || game.getIsTie()) return;

    // Get clicked cell position
    const row = event.target.dataset.row;
    const col = event.target.dataset.column;

    // converts value in number
    game.playRound(Number(row), Number(col));
    updateScreen;
  }
  // Initialize the first screen render
  gameBoardDiv.addEventListener("click", clickHandler);
  updateScreen(); // initialize render
}

let players;

// Dialog and Form data showModal
const getPlayers = (function () {
  const dialog = document.querySelector("#dialog");
  dialog.showModal();

  const form = document.querySelector("#players");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // get the form data in the built-in browser API (FormData)
    const formData = new FormData(form);

    // gives a key/value pairs
    // turns it into regular object using => Object.fromEntries()
    players = Object.fromEntries(formData.entries());
    ScreenController(players.playerOne, players.playerTwo);
    dialog.closest();
  });
})();

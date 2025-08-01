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

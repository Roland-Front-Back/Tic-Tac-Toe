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

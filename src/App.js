import React, { useState, useEffect } from "react";
import "./App.css";

const initialBoard = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const checkWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diagonals
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Draw";
  };

  const aiMove = () => {
    const emptyIndices = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);
    setIsPlayerTurn(true);
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
    } else if (!isPlayerTurn) {
      setTimeout(aiMove, 500); // Delay AI to feel more natural
    }
  }, [board, isPlayerTurn]);

  const resetGame = () => {
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      {winner && (
        <div className="winner">
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </div>
      )}
      <div className="board">
        {board.map((val, idx) => (
          <div
            key={idx}
            className="square"
            onClick={() => handleClick(idx)}
          >
            {val}
          </div>
        ))}
      </div>
      <button onClick={resetGame}>Restart</button>
    </div>
  );
};

export default App;

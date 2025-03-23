import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const initialBoard = Array(9).fill(null);

const App = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [fadingOut, setFadingOut] = useState(false);

  const [playerWins, setPlayerWins] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const prevPlayerWins = useRef(0);
  const prevAiWins = useRef(0);
  const prevDraws = useRef(0);

  const handleClick = (index) => {
    if (!isPlayerTurn || board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],[3, 4, 5],[6, 7, 8],
      [0, 3, 6],[1, 4, 7],[2, 5, 8],
      [0, 4, 8],[2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Draw";
  };

  const resetGame = () => {
    setFadingOut(true);
    setTimeout(() => {
      setBoard(initialBoard);
      setIsPlayerTurn(true);
      setWinner(null);
      setFadingOut(false);
    }, 300); // Match CSS fade-out duration
  };

  const aiMove = () => {
    const bestMove = getBestMove(board);
    if (bestMove !== null) {
      const newBoard = [...board];
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const getBestMove = (currentBoard) => {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const tempBoard = [...currentBoard];
        tempBoard[i] = "O";
        const score = minimax(tempBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  const minimax = (boardState, depth, isMaximizing) => {
    const result = checkWinner(boardState);
    if (result !== null) {
      if (result === "O") return 10 - depth;
      if (result === "X") return depth - 10;
      if (result === "Draw") return 0;
    }

    const scores = boardState.map((_, i) => {
      if (boardState[i] === null) {
        boardState[i] = isMaximizing ? "O" : "X";
        const score = minimax(boardState, depth + 1, !isMaximizing);
        boardState[i] = null;
        return score;
      }
      return isMaximizing ? -Infinity : Infinity;
    });

    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
  };

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result);
      if (result === "X") setPlayerWins((w) => w + 1);
      else if (result === "O") setAiWins((w) => w + 1);
      else setDraws((d) => d + 1);
    } else if (!isPlayerTurn) {
      const timeout = setTimeout(aiMove, 300);
      return () => clearTimeout(timeout);
    }
  }, [board, isPlayerTurn]);

  useEffect(() => {
    prevPlayerWins.current = playerWins;
    prevAiWins.current = aiWins;
    prevDraws.current = draws;
  }, [playerWins, aiWins, draws]);

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>

      <div className="scoreboard">
        <div className={playerWins > prevPlayerWins.current ? "fade" : ""}>
        You: {playerWins}
        </div>
        <div className={aiWins > prevAiWins.current ? "fade" : ""}>
         AI: {aiWins}
        </div>
        <div className={draws > prevDraws.current ? "fade" : ""}>
         Draws: {draws}
        </div>
      </div>

      {winner && (
        <div className="winner">
          {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
        </div>
      )}

      <div className={`board ${fadingOut ? "fade-out" : ""}`}>
        {board.map((val, idx) => (
          <div
            key={idx}
            className="square"
            onClick={() => handleClick(idx)}
          >
            {val && <span className="marker">{val}</span>}
          </div>
        ))}
      </div>

      <button onClick={resetGame}>Restart</button>
    </div>
  );
};

export default App;

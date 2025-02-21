import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
    return (
        <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext ? 'X' : 'O';
        onPlay(nextSquares, i);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (squares.every(square => square !== null)) {
        status = 'Draw! No one wins.';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    const boardRows = [];
    for (let row = 0; row < 3; row++) {
        const boardSquares = [];
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            boardSquares.push(
                <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    isWinningSquare={winningSquares && winningSquares.includes(index)}
                />
            );
        }
        boardRows.push(
            <div key={row} className="board-row">
                {boardSquares}
            </div>
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveLocation: null }]);
    const [currentMove, setCurrentMove] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [sortAscending, setSortAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares, index) {
        const row = Math.floor(index / 3) + 1;
        const col = (index % 3) + 1;
        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            { squares: nextSquares, moveLocation: `(${row}, ${col})` },
        ];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);

        const winner = calculateWinner(nextSquares);
        if (winner) {
            setShowImage(true);
        }
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
        setShowImage(false);
    }

    const toggleSortOrder = () => {
        setSortAscending(!sortAscending);
    };

    const moves = history.map((step, move) => {
        const description = move > 0 ? `Go to move #${move} ${step.moveLocation}` : 'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const sortedMoves = sortAscending ? moves : moves.slice().reverse();

    const winner = calculateWinner(currentSquares);
    const winningSquares = winner ? getWinningSquares(currentSquares) : null;

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                    winningSquares={winningSquares}
                />
            </div>
            <div className="game-info">
                <div>You are at move #{currentMove}</div>
                <button onClick={toggleSortOrder}>
                    Sort moves {sortAscending ? 'Descending' : 'Ascending'}
                </button>
                <ol>{sortedMoves}</ol>
            </div>
            {showImage && (
                <div className="image">
                    <img src="/img.png" alt="image" />
                </div>
            )}
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function getWinningSquares(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}
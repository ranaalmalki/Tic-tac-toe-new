import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import xImage from '../src/assets/X.png'; // تأكد من مسار الصورة
import oImage from '../src/assets/O.png'; // تأكد من مسار الصورة
import './App.css'; // استيراد ملف CSS

const App = () => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameId, setGameId] = useState(null);
    const [winner, setWinner] = useState(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });

    const checkWinner = (board) => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const isDraw = (board) => {
        return board.every(cell => cell !== null);
    };

    const handleCellClick = async (index) => {
        if (board[index] || !gameId) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setWinner(winner);
            setScores(prevScores => ({
                ...prevScores,
                [winner]: prevScores[winner] + 1
            }));
            await Swal.fire({
                title: 'Game Over!',
                text: `Player ${winner} wins!`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            handleRestartGame(); // إعادة بدء اللعبة بعد الفوز
            return;
        }

        if (isDraw(newBoard)) {
            await Swal.fire({
                title: 'Game Over!',
                text: 'It\'s a draw!',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            handleRestartGame(); // إعادة بدء اللعبة بعد التعادل
            return;
        }

        await axios.put(`http://localhost:5000/api/games/${gameId}`, { board: newBoard });
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    const handleStartGame = async () => {
        const res = await axios.post('http://localhost:5000/api/games', { player1, player2 });
        setGameId(res.data._id);
        setBoard(res.data.board);
        setCurrentPlayer('X');
        setWinner(null);

        Swal.fire({
            title: 'Game Started!',
            text: `${player1} vs ${player2}`,
            icon: 'info',
            confirmButtonText: 'Okay'
        });
    };

    const handleRestartGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        Swal.fire({
            title: 'New Game Started!',
            icon: 'info',
            confirmButtonText: 'Okay'
        });
    };

    return (
        <div className='flex flex-wrap flex-col items-center p-20 '>
            <h1 className='text-3xl font-bold'>Tic Tac Toe</h1>
            <div className=' flex flex-wrap gap-2'>
            <input
            className='border p-4 rounded-md text-center'
                type="text"
                placeholder="Player 1 Name"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
            />
            <input
                        className='border p-4 rounded-md text-center'
                type="text"
                placeholder="Player 2 Name"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
            />
            </div>
            <button onClick={handleStartGame} className='btn bg-cyan-700 p-2 rounded-full mt-2'>Start Game</button>

            <h2 className='font-bold'>Scores:</h2>
            <div className=' flex flex-wrap gap-10'>

            <p>{player1 || 'Player 1'} (X): {scores.X}</p>
            <p>{player2 || 'Player 2'} (O): {scores.O}</p>
</div>
            {winner && <h2>Player {winner} wins!</h2>}

            <div className="board">
                {board.map((cell, index) => (
                    <div key={index} className={`cell ${cell}`} onClick={() => handleCellClick(index)}>
                        {cell === 'X' && <img src={xImage} alt="X" />}
                        {cell === 'O' && <img src={oImage} alt="O" />}
                    </div>
                ))}
            </div>

            {winner && <button onClick={handleRestartGame}>Play Again</button>}
        </div>
    );
};

export default App;

import mongoose from "mongoose";
// نموذج اللعبة مع إضافة خصائص للفوز
const gameSchema = new mongoose.Schema({
    player1: { name: String, wins: { type: Number, default: 0 } },
    player2: { name: String, wins: { type: Number, default: 0 } },
    board: Array,
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // استبدل هذا بالمنفذ الخاص بواجهة المستخدم
}));
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

main();

// إنشاء لعبة جديدة
app.post('/api/games', async (req, res) => {
  const { player1, player2 } = req.body;
  const newGame = new Game({
      player1: { name: player1, wins: 0 },
      player2: { name: player2, wins: 0 },
      board: Array(9).fill(null)
  });
  await newGame.save();
  res.json(newGame);
});
// الحصول على اللعبة
app.get('/api/games/:id', async (req, res) => {
    const game = await Game.findById(req.params.id);
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
});

// تحديث اللعبة
app.put('/api/games/:id', async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json(game);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

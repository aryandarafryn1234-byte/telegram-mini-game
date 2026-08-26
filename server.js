// server.js (Node.js Express Backend)
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';

// Validate Telegram Mini App Data securely
function verifyTelegramWebAppData(telegramInitData) {
    const urlParams = new URLSearchParams(telegramInitData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    const params = [];
    for (const [key, value] of urlParams.entries()) {
        params.push(`${key}=${value}`);
    }
    params.sort();

    const dataCheckString = params.join('\n');
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calculatedHash === hash;
}

// In-memory mock DB (use PostgreSQL/MongoDB for production)
const users = {};

// Auth & Fetch User Profile
app.post('/api/auth', (req, res) => {
    const { initData } = req.body;
    if (!verifyTelegramWebAppData(initData)) {
        return res.status(401).json({ error: 'Unauthorized data validation failed' });
    }

    const urlParams = new URLSearchParams(initData);
    const user = JSON.parse(urlParams.get('user'));

    if (!users[user.id]) {
        users[user.id] = {
            id: user.id,
            username: user.username || user.first_name,
            balance: 100, // Welcome bonus
            spinsLeft: 3,
            referrals: 0,
            claimedTasks: []
        };
    }

    res.json({ success: true, user: users[user.id] });
});

// Spin & Open Mystery Box
app.post('/api/open-box', (req, res) => {
    const { userId } = req.body;
    const user = users[userId];

    if (!user || user.spinsLeft <= 0) {
        return res.status(400).json({ error: 'No energy or spins left!' });
    }

    user.spinsLeft -= 1;
    // Weighted random rewards (Coins, Rare Tickets, or Empty)
    const rewards = [10, 25, 50, 100, 500];
    const wonAmount = rewards[Math.floor(Math.random() * rewards.length)];
    
    user.balance += wonAmount;

    res.json({
        success: true,
        wonAmount,
        balance: user.balance,
        spinsLeft: user.spinsLeft
    });
});

app.listen(3001, () => console.log('Gift App Server running on port 3001'));
                                        

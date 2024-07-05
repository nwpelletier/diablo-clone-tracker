const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));

app.get('/api/status', async (req, res) => {
    try {
        const apiUrl = 'https://www.d2emu.com/api/v1/dclone';

        const response = await axios.get(apiUrl);
        const statusData = response.data;

        const allLadders = {
            krNonLadder: statusData.krNonLadder,
            krNonLadderHardcore: statusData.krNonLadderHardcore,
            krLadder: statusData.krLadder,
            krLadderHardcore: statusData.krLadderHardcore,
            usNonLadder: statusData.usNonLadder,
            usNonLadderHardcore: statusData.usNonLadderHardcore,
            usLadder: statusData.usLadder,
            usLadderHardcore: statusData.usLadderHardcore,
            euNonLadder: statusData.euNonLadder,
            euNonLadderHardcore: statusData.euNonLadderHardcore,
            euLadder: statusData.euLadder,
            euLadderHardcore: statusData.euLadderHardcore
        };

        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json(allLadders);
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

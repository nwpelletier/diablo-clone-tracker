const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.static('public'));

const nameMapping = {
    krNonLadder: "Korean Non Ladder",
    krNonLadderHardcore: "Korean Non Ladder Hardcore",
    krLadder: "Korean Ladder",
    krLadderHardcore: "Korean Ladder Hardcore",
    usNonLadder: "US Non Ladder",
    usNonLadderHardcore: "US Non Ladder Hardcore",
    usLadder: "US Ladder",
    usLadderHardcore: "US Ladder Hardcore",
    euNonLadder: "EU Non Ladder",
    euNonLadderHardcore: "EU Non Ladder Hardcore",
    euLadder: "EU Ladder",
    euLadderHardcore: "EU Ladder Hardcore"
};

// api route!
app.get('/api/status', async (req, res) => {
    try {
        const apiUrl = 'https://www.d2emu.com/api/v1/dclone';
        const response = await axios.get(apiUrl);
        const statusData = response.data;

        const allLadders = {
            krNonLadder: { commonName: "KR", statusData: statusData.krNonLadder },
            krNonLadderHardcore: { commonName: "KR HC", statusData: statusData.krNonLadderHardcore },
            krLadder: { commonName: "KR Ladder", statusData: statusData.krLadder },
            krLadderHardcore: { commonName: "KR Ladder HC", statusData: statusData.krLadderHardcore },
            usNonLadder: { commonName: "US", statusData: statusData.usNonLadder },
            usNonLadderHardcore: { commonName: "US HC", statusData: statusData.usNonLadderHardcore },
            usLadder: { commonName: "US Ladder", statusData: statusData.usLadder },
            usLadderHardcore: { commonName: "US Ladder HC", statusData: statusData.usLadderHardcore },
            euNonLadder: { commonName: "EU", statusData: statusData.euNonLadder },
            euNonLadderHardcore: { commonName: "EU HC", statusData: statusData.euNonLadderHardcore },
            euLadder: { commonName: "EU Ladder", statusData: statusData.euLadder },
            euLadderHardcore: { commonName: "EU Ladder HC", statusData: statusData.euLadderHardcore }
        };
        
        

        res.json({allLadders});
    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
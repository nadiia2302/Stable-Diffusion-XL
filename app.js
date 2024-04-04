const express = require('express');
const fal = require('@fal-ai/serverless-client');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

fal.config({
    credentials: "d4e3ffa7-cded-47a2-a53d-f308ec28ac68:22aa60f4ca9ad4058d44f1c80d25d86f",
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/generate', async (req, res, next) => {
    const data = req.body;

    const result = await fal.subscribe("fal-ai/fast-sdxl", {

        input: {
            prompt: data.userPrompt,
        },
        logs: true,
        onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
                update.logs.map((log) => log.message).forEach(console.log);
            }
        },
    });

    res.json({
        status_code: 200,
        status_message: "create-image:success",
        result: result,
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


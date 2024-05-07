// app.js

import express from 'express';
import ReplicateService from './replicateService.js';

const app = express();
const PORT = 3001;
const replicateService = new ReplicateService();

app.get('/test-image-data/:trainingId', async (req, res) => {
    try {
        const { trainingId } = req.params;
        const classPrompt = "A photo of a woman";
        const instancePrompt = "a headshot portrait photo of a business woman";
        const output = await replicateService.testImageData(trainingId, classPrompt, instancePrompt);
        res.status(200).json({ output });
    } catch (error) {res.status(500).json({ error: 'Error in generating the image' });}
        
    
});

app.listen(PORT, () => {
    console.log(`Testing Server is running on http://localhost:${PORT}`);
});

require('dotenv').config();

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

const replicateApiToken = process.env.REPLICATE_API_TOKEN;

let trainingData = {}; 

app.post('/start-training', upload.array('zips', 5), async (req, res) => {
    try {
        const zipFiles = req.files;
        const trainingIds = await startTraining(zipFiles);
        
        res.status(200).json({ trainingIds });
    } catch (error) {
        // console.error('Error starting training:', error);
        res.status(500).json({ error: 'Error starting training the data, please check' });
    }
});

app.get('/training-status/:trainingId', async (req, res) => {
    try {
        const { trainingId } = req.params;
        const data = await getTrainingInfo(trainingId);
        const status = data.status;

        res.status(200).json({ status });
    } catch (error) {
        // console.error('Error checking training status:', error);
        res.status(500).json({ error: 'Error checking training the status of the trainigm' });
    }
});

app.get('/use-instance-data/:trainingId', async (req, res) => {
    try {
        const { trainingId } = req.params;
        const trainingInfo = await getTrainingStatus(trainingId);

        if (trainingInfo.status !== 'succeeded') {
            return res.status(400).json({ error: 'Training is still in progress.... Be patient :)' });
        }
        
        const instanceData = trainingInfo.input.instance_data;

        res.status(200).json({ instanceData });
    } catch (error) {
        // console.error('Error using instance data:', error);
        res.status(500).json({ error: 'Error using the  instance data' });
    }
});



async function startTraining(zipFiles) {
    const trainingIds = [];

    for (const zipFile of zipFiles) {
        const zipData = fs.readFileSync(zipFile.path);
        const formData = new FormData();
        formData.append('file', zipData, { filename: zipFile.originalname });

        const response = await axios.post('https://dreambooth-api-experimental.replicate.com/v1/upload', formData, {
            headers: {
                'Authorization': `Bearer ${replicateApiToken}`,
                ...formData.getHeaders(),
            },
        });

        const servingURL = response.data.serving_url;
        const trainingId = await initiateTraining(servingURL);
        trainingIds.push(trainingId);
    }

    return trainingIds;
}

async function initiateTraining(servingURL) {
    
    const response = await axios.post('https://dreambooth-api-experimental.replicate.com/v1/trainings', {
        input: {
            instance_prompt: 'a headshot photo of a businesswoman',
            class_prompt: 'a photo of a person',
            instance_data: servingURL,
            max_train_steps: 3000,
        },
        model: 'akh1ln/headshot_generator',
        trainer_version: 'cd3f925f7ab21afaef7d45224790eedbb837eeac40d22e8fefe015489ab644aa',
        webhook_completed: 'https://example.com/dreambooth-webhook',
    }, {
        headers: {
            'Authorization': `Bearer ${replicateApiToken}`,
            'Content-Type': 'application/json',
        },
    });

    const trainingId = response.data.id;
  
    trainingData[trainingId] = servingURL;

    return trainingId;
}

async function getTrainingInfo(trainingId) {
    
    const response = await axios.get(`https://dreambooth-api-experimental.replicate.com/v1/trainings/${trainingId}`, {
        headers: {
            'Authorization': `Bearer ${replicateApiToken}`,
            'Content-Type': 'application/json',
        },
    });

    return response.data;
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

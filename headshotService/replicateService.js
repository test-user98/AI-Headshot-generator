const Replicate = require('replicate');
const axios = require('axios');

class ReplicateService {
    constructor() {
        this.replicate = new Replicate();
    }

    async testImageData(trainingId, classPrompt, instancePrompt) {
        const instanceData = await this.getInstanceData(trainingId);
        const input = { class_prompt: classPrompt, instance_data: instanceData, instance_prompt: instancePrompt };
        const modelId = "replicate/dreambooth:a8ba568da0313951a6b311b43b1ea3bf9f2ef7b9fd97ed94cebd7ffd2da66654";
        const output = await this.replicate.run(modelId, { input });
        return output;
    }

    async getInstanceData(trainingId) {
        try {
            const response = await axios.get(`http://localhost:3000/use-instance-data/${trainingId}`);
            return response.data.instanceData;
        } catch (error) {
            throw new Error('Error fetching instance data');
        }
    }
}

export default ReplicateService;

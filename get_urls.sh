#!/bin/bash
REPLICATE_API_TOKEN='r8_GAhZVDwmyx4YUPxmZbnDoTBY5lAreCC3Y4kvV'
# Make the first curl request to get the response
RESPONSE=$(curl -X POST -H "Authorization: Bearer $REPLICATE_API_TOKEN" https://dreambooth-api-experimental.replicate.com/v1/upload/data.zip)

# Extract the upload URL from the response using jq
UPLOAD_URL=$(echo "$RESPONSE" | jq -r ".upload_url")

# Use the upload URL to upload the file
curl -X PUT -H "Content-Type: application/zip" --upload-file data.zip "$UPLOAD_URL"

# Extract the serving URL from the response using jq
SERVING_URL=$(echo "$RESPONSE" | jq -r ".serving_url")

TRAINING_RESPONSE_FILE="training_response.json"
curl -X POST \
    -H "Authorization: Bearer $REPLICATE_API_TOKEN" \
    -d '{
            "input": {
                "instance_prompt": "a portrait headshot of a business woman.",
                "class_prompt": "a photo of a woman",
                "instance_data": "'"$SERVING_URL"'",
                "max_train_steps": 1000
            },
            "model": "akh1ln/headshot_generator",
            "trainer_version": "d5e058608f43886b9620a8fbb1501853b8cbae4f45c857a014011c86ee614ffb",
            "webhook_completed": "https://webhook.site/426234fb-ab2e-4079-b972-374a419c350d"
        }' \
    https://dreambooth-api-experimental.replicate.com/v1/trainings > "$TRAINING_RESPONSE_FILE"

echo "Training job started! Response saved to $TRAINING_RESPONSE_FILE"

# echo "Upload URL: $UPLOAD_URL"
# echo "Serving URL: $SERVING_URL"

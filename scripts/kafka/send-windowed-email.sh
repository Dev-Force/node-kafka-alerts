#!/bin/sh
echo "{\"userUUID\": \"70d0a457-869c-4d22-a3ea-d75ed3404dbb\", \"notificationUUID\": \"ddde52bd-9ce1-4567-9b07-6cd4f2df53d6\", \"channel\": \"EMAIL\", \"subject\": \"test subject\", \"template\": \"template-example\", \"uniqueGroupIdentifiers\": [ \"userUUID\", \"sensorId\", \"thresholdName\"], \"unmappedData\": {\"userUUID\": \"70d0a457-869c-4d22-a3ea-d75ed3404dbb\", \"sensorId\": \"Sensor ID HERE\", \"thresholdName\": \"Threshold Name HERE\"}}" | 
docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic windowed-notifications

#!/bin/sh
echo "{\"userUUID\": \"1887cf16-4283-4c60-b643-81010c624d0f\", \"notificationUUID\": \"ddde52bd-9ce1-4567-9b07-6cd4f2df53d6\", \"channel\": \"EMAIL\", \"subject\": \"test subject\", \"template\": \"template-example\", \"unmappedData\": {\"name\": \"Tolis\", \"realm\": \"kafka notifications microservice\"}}" | 
docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic windowed-notifications

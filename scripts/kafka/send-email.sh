#!/bin/sh
echo "{\"channel\": \"EMAIL\", \"recipient\": \"apostolos94@gmail.com\", \"template\": \"template-example.hbs\", \"unmappedData\": {\"name\": \"Tolis\", \"realm\": \"kafka notifications microservice\"}}" | docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic notification-alerts

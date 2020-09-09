#!/bin/sh
echo "{\"channel\": \"EMAIL\", \"recipient\": \"apostolos94@gmail.com\"}" | docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic notification-alerts

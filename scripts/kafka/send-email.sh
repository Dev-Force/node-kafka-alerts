#!/bin/sh
echo "{\"send_email\": true}" | docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic notification-alerts

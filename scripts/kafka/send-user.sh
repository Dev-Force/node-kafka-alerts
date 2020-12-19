#!/bin/sh
echo "{\"uuid\": \"1887cf16-4283-4c60-b643-81010c624d0f\", \"email\": \"example@example.com\", \"phone\": \"+306912345678\"}" | 
docker-compose exec -T kafka bin/kafka-console-producer.sh --broker-list kafka:9092 --topic users

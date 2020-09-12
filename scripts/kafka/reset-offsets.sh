#!/bin/sh
docker-compose exec -T kafka bin/kafka-consumer-groups.sh \
    --bootstrap-server kafka:9092 \
    --group notificationservice01 \
    --topic notification-alerts \
    --reset-offsets \
    --to-latest \
    --execute

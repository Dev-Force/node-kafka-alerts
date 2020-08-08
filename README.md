# vehicle-history-mvp

After `docker-compose up -d`

`curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" --data-binary @connect-payload.json localhost:8083/connectors/`

This is done in order for kafka connect to listen to postgres through pgoutput and send to
fullfillment.public.vehicle_events kafka topic.

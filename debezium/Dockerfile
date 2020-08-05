FROM postgres:12-alpine

LABEL maintainer="Debezium Community"

# Copy the custom configuration which will be passed down to the server (using a .sample file is the preferred way of doing it by 
# the base Docker image)
COPY postgresql.conf.sample /usr/local/share/postgresql/postgresql.conf.sample

# Copy the script which will initialize the replication permissions
COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

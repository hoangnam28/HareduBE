#!/bin/bash
set -e

mongod --replSet "${MONGO_REPLICA_SET_NAME:-rs0}" --bind_ip_all &

while ! mongosh --eval "db.runCommand('ping').ok" --quiet; do
    sleep 1
done

echo "MongoDB is ready."

if ! mongosh --eval "rs.status().ok" --quiet; then
    echo "Initializing replica set..."
    mongosh --eval "rs.initiate()"
else
    echo "Replica set already initialized."
fi

wait

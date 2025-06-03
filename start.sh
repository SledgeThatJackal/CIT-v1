#!/bin/sh

echo "Running Migrations..."
npx drizzle-kit migrate

echo "Starting Server..."
npm start
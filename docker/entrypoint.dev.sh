#!/bin/sh
set -e

if [ ! -d node_modules/@nestjs/core ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Watching Prisma schema and generating client..."
npx prisma generate --watch &

echo "Starting NestJS in watch mode..."
exec npm run start:dev

#!/bin/sh
set -e

if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  echo "Dependencies changed, running npm install..."
  npm install
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Watching Prisma schema..."
npx prisma generate --watch &

echo "Starting NestJS in watch mode..."
exec npm run start:dev

#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Start the development server
echo "Starting development server..."
npm run dev
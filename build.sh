#!/usr/bin/env bash
# Nixpacks build script for Railway

echo "Starting build process..."

# Navigate to backend directory
cd backend

echo "Installing backend dependencies..."
npm install

echo "Build completed successfully!"
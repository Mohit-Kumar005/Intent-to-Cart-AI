#!/bin/bash
echo "============================================"
echo "  Intent-to-Cart AI - Setup Script"
echo "============================================"
echo ""
echo "Installing backend dependencies..."
cd backend && npm install
if [ ! -f .env ]; then cp .env.example .env; fi
echo "Installing frontend dependencies..."
cd ../frontend && npm install
echo ""
echo "Setup Complete!"
echo "Run: cd backend && npm run dev (Terminal 1)"
echo "Run: cd frontend && npm run dev (Terminal 2)"
echo "Open: http://localhost:5173"

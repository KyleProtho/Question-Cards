#!/bin/bash

# Run Flask development server
# This script starts the Flask app for development

echo "🚀 Starting Flask development server..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Check if all_questions.json exists
if [ ! -f "all_questions.json" ]; then
    echo "⚠️  all_questions.json not found. Running data generation script..."
    python scripts/create_all_questions_json.py
fi

# Start Flask server
echo "🌐 Starting Flask server on http://localhost:5001"
echo "📱 Press Ctrl+C to stop the server"
echo ""

python app.py

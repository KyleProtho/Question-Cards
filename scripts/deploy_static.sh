#!/bin/bash

# Deploy static version for GitHub Pages
# This script prepares the static version for deployment

echo "🚀 Preparing static version for deployment..."

# Create deployment directory
DEPLOY_DIR="deploy"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy static files
echo "📁 Copying static files..."
cp -r static/* $DEPLOY_DIR/

# Copy data files
echo "📊 Copying data files..."
mkdir -p $DEPLOY_DIR/data
cp all_questions.json $DEPLOY_DIR/data/

# Create a simple index.html redirect for GitHub Pages
echo "📄 Creating index.html..."
cp $DEPLOY_DIR/index.html $DEPLOY_DIR/index.html.backup
cat > $DEPLOY_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Question Cards</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <h1>Question Cards</h1>
            <p>Conversation starters for fun and meaningful connections</p>
        </header>

        <!-- Setup Phase -->
        <div id="setup-phase" class="phase active">
            <div class="setup-container">
                <h2>Customize Your Questions</h2>
                
                <!-- Deck Filter -->
                <div class="deck-filter-section">
                    <h3>Select Decks</h3>
                    <p class="filter-help">Choose which question decks to draw from:</p>
                    
                    <div class="deck-checkboxes">
                        <!-- Deck checkboxes will be populated dynamically -->
                    </div>
                </div>

                <!-- Category Filters -->
                <div class="filters-section">
                    <h3>Filter by Categories</h3>
                    <p class="filter-help">Set maximum intensity levels (1-5) for each category:</p>
                    
                    <div class="filter-grid">
                        <!-- Category sliders will be populated dynamically -->
                    </div>
                </div>

                <!-- Number of Questions -->
                <div class="question-count-section">
                    <label for="question-count">How many questions do you want?</label>
                    <input type="number" id="question-count" min="1" max="16" value="10" class="question-input">
                    <div class="available-count">
                        Eligible questions: <span id="available-count">0</span>
                    </div>
                </div>

                <!-- Start Button -->
                <button id="start-game" class="start-btn" disabled>
                    Start Drawing Cards
                </button>
            </div>
        </div>

        <!-- Game Phase -->
        <div id="game-phase" class="phase">
            <div class="game-container">
                <!-- Progress -->
                <div class="progress-section">
                    <div class="progress-info">
                        <span id="current-card">1</span> of <span id="total-cards">10</span>
                    </div>
                    <div class="progress-bar">
                        <div id="progress-fill" class="progress-fill"></div>
                    </div>
                </div>

                <!-- Question Card -->
                <div class="question-card">
                    <div class="card-content">
                        <div class="question-text" id="question-text">
                            Loading your question...
                        </div>
                        
                        <div class="question-meta">
                            <div class="category-tags" id="category-tags">
                                <!-- Category indicators will be added here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Navigation -->
                <div class="navigation">
                    <button id="prev-btn" class="nav-btn" disabled>
                        ← Previous
                    </button>
                    <button id="next-btn" class="nav-btn">
                        Next →
                    </button>
                </div>

                <!-- Actions -->
                <div class="game-actions">
                    <button id="new-game-btn" class="action-btn secondary">
                        🔄 New Game
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/static-script.js"></script>
</body>
</html>
EOF

# Create a README for the deployment
echo "📝 Creating deployment README..."
cat > $DEPLOY_DIR/README.md << 'EOF'
# Question Cards - Static Version

This is the static version of the Question Cards app, designed to run on GitHub Pages or any static hosting service.

## Features

- Load questions directly from JSON files
- Filter questions by deck and category
- Responsive design for mobile and desktop
- Touch/swipe support for mobile devices
- Local storage for user preferences

## How to Deploy

1. Copy all files in this directory to your web server
2. Ensure the `data/` directory is accessible
3. The app will work without any server-side processing

## Development

For development with Flask backend, see the main project directory.
EOF

echo "✅ Static deployment ready in ./$DEPLOY_DIR/"
echo "📋 To deploy to GitHub Pages:"
echo "   1. Copy contents of ./$DEPLOY_DIR/ to your gh-pages branch"
echo "   2. Or use GitHub Actions to automate deployment"
echo ""
echo "🌐 To test locally:"
echo "   cd $DEPLOY_DIR && python -m http.server 8000"
echo "   Then visit http://localhost:8000"

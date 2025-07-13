# 🎴 Question Cards

A web application that provides conversation starters for meaningful connections. Filter questions by intensity across multiple categories to create the perfect set of conversation prompts for any situation.

**🌐 Live Demo**: [https://kyleprotho.github.io/Question-Cards/](https://kyleprotho.github.io/Question-Cards/)

## ✨ Features

- **Customizable Filtering**: Set minimum intensity levels (1-5) across 8 different categories
- **Interactive Interface**: Touch/swipe support for mobile devices plus keyboard navigation
- **Smart Question Selection**: Randomly selects from filtered questions to ensure variety
- **Progress Tracking**: Visual progress bar and navigation through your question set
- **Persistent Preferences**: Saves your filter settings for future sessions

## 🎯 Categories

Questions are rated across 8 dimensions:

- 💔 **Vulnerability** - How emotionally open the question requires you to be
- 💕 **Sexuality** - How intimate or romantic the topic is
- 📖 **Personal History** - How much it delves into your past experiences
- 😄 **Humor** - How funny or lighthearted the question is
- 🤔 **Self-Reflection** - How much introspection the question requires
- 😳 **Embarrassment Potential** - How potentially embarrassing the answer might be
- 🔗 **Depth of Connection** - How much the question builds intimacy between people
- ⚡ **Conflict Potential** - How likely the question is to cause disagreement

## 🚀 Getting Started

### Prerequisites

- Python 3.x (for data processing)
- A local web server (built-in Python server works fine)

### Installation

1. Clone or download this repository
2. Navigate to the project directory

### Running the Application

Since this application loads data via fetch(), you need to serve it through a web server:

```bash
# Using Python's built-in server
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## 📊 Data Management

### Adding New Questions

1. Add questions to CSV files in the `decks/` directory
2. Ensure each question has ratings (1-5) for all 8 categories
3. Convert CSV to JSON format:

```bash
python3 scripts/csv_to_json.py
```

### CSV Format

Your CSV should include these columns:
- `Index` - Question number
- `Question` - The question text
- `Vulnerability` - Rating 1-5
- `Sexuality` - Rating 1-5
- `Personal History` - Rating 1-5
- `Humor` - Rating 1-5
- `Self-Reflection` - Rating 1-5
- `Embarrassment Potential` - Rating 1-5
- `Depth of Connection` - Rating 1-5
- `Conflict Potential` - Rating 1-5

## 🎮 How to Use

1. **Set Your Filters**: Use the sliders to set minimum intensity levels for each category
2. **Choose Question Count**: Select how many questions you want (up to available filtered questions)
3. **Start Drawing Cards**: Begin your conversation session
4. **Navigate**: Use arrow keys, swipe gestures, or navigation buttons to move between questions
5. **New Game**: Reset to try different filters or get a new random selection

## 🎯 Navigation Controls

- **Desktop**: Arrow keys (←/→), Escape to return to setup
- **Mobile**: Swipe left/right to navigate between questions
- **Universal**: Click Previous/Next buttons

## 📁 Project Structure

```
question_cards/
├── index.html          # Main application interface
├── script.js           # Application logic and interactions
├── styles.css          # Styling and responsive design
├── data/
│   └── truth_or_drink.json  # Processed question data (412 questions)
├── decks/
│   └── truth_or_drink.csv   # Source question data
└── scripts/
    └── csv_to_json.py       # Data conversion utility
```

## 🤝 Contributing

1. Add new questions to CSV files in the `decks/` directory
2. Run the conversion script to update JSON data
3. Test the application with your new questions
4. Submit your changes

## 📝 License

This project is open source and available under the MIT License.

## 🎲 Current Dataset

The application comes with 412 carefully curated conversation starter questions designed to foster meaningful connections while respecting boundaries through the category filtering system.
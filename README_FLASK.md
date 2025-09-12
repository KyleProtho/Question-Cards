# Question Cards Flask App

This is a Flask web application version of the Question Cards project. It provides conversation starters for fun and meaningful connections.

## Features

- **Multiple Question Decks**: Choose from different question collections
- **Category Filtering**: Filter questions by intensity levels across various categories
- **Customizable Game**: Select how many questions you want to play
- **Responsive Design**: Works on desktop and mobile devices
- **API Endpoints**: RESTful API for question filtering and retrieval

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure the `all_questions.json` file is in the project root directory.

## Running the Application

1. Start the Flask development server:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

- `GET /` - Main application page
- `GET /api/questions` - Get all questions
- `GET /api/decks` - Get available question decks
- `GET /api/categories` - Get available categories
- `POST /api/questions/filter` - Filter questions based on criteria

## Project Structure

```
question_cards/
├── app.py                 # Main Flask application
├── all_questions.json     # Question data
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── styles.css    # Application styles
    └── js/
        └── script.js     # Application JavaScript
```

## Development

The application runs in debug mode by default. To run in production:

1. Set the `FLASK_ENV` environment variable to `production`
2. Use a production WSGI server like Gunicorn

## Original Files

The original static HTML files (`index.html`, `script.js`, `styles.css`) are preserved in the root directory for reference.

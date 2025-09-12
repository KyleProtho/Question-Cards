from flask import Flask, render_template, jsonify, request
import json
import os
import random

app = Flask(__name__)

# Load questions data
def load_questions():
    """Load questions from the JSON file"""
    try:
        with open('all_questions.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"questions": [], "metadata": {}}

# Global variable to store questions data
questions_data = load_questions()

@app.route('/')
def index():
    """Main page route"""
    return render_template('index.html')

@app.route('/api/questions')
def get_questions():
    """API endpoint to get all questions"""
    return jsonify(questions_data)

@app.route('/api/questions/filter', methods=['POST'])
def filter_questions():
    """API endpoint to filter questions based on criteria"""
    try:
        data = request.get_json()
        
        # Get filter criteria
        selected_decks = data.get('decks', [])
        category_filters = data.get('categories', {})
        max_questions = data.get('maxQuestions', 16)
        
        # Filter questions
        filtered_questions = []
        
        for question in questions_data.get('questions', []):
            # Check if question is from selected deck
            if question.get('sourceFile') not in selected_decks:
                continue
                
            # Check category filters
            question_categories = question.get('categories', {})
            passes_filters = True
            
            for category, max_value in category_filters.items():
                question_value = question_categories.get(category, 1)
                if question_value > max_value:
                    passes_filters = False
                    break
            
            if passes_filters:
                filtered_questions.append(question)
        
        # Randomly select questions if requested count is less than available
        if len(filtered_questions) > max_questions:
            filtered_questions = random.sample(filtered_questions, max_questions)
        
        return jsonify({
            'questions': filtered_questions,
            'total': len(filtered_questions),
            'available': len(filtered_questions)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/decks')
def get_decks():
    """API endpoint to get available decks"""
    decks = []
    for source in questions_data.get('metadata', {}).get('sources', []):
        decks.append({
            'filename': source['filename'],
            'displayName': source['filename'].replace('.json', '').replace('_', ' ').title(),
            'count': source['originalQuestions']
        })
    return jsonify(decks)

@app.route('/api/categories')
def get_categories():
    """API endpoint to get available categories"""
    return jsonify(questions_data.get('metadata', {}).get('categories', []))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

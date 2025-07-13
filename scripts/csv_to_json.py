#!/usr/bin/env python3
"""
CSV to JSON Converter for Question Cards
Converts CSV files in the decks/ directory to JSON format for easier JavaScript consumption.
"""

import json
import os
import sys
from pathlib import Path
import pandas as pd

def parse_csv_file(csv_path):
    """Parse a CSV file and return structured question data using pandas."""
    questions = []
    
    try:
        # Try different encodings with pandas
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        df = None
        
        for encoding in encodings:
            try:
                df = pd.read_csv(csv_path, encoding=encoding)
                print(f"Successfully read CSV with {encoding} encoding")
                break
            except UnicodeDecodeError:
                continue
        
        if df is None:
            print(f"Error: Could not read CSV file with any encoding: {csv_path}")
            return []
        
        # Process each row
        for index, row in df.iterrows():
            try:
                question_data = {
                    'index': int(row.get('Index', index + 1)),
                    'text': str(row.get('Question', '')).strip().strip('"'),
                    'categories': {
                        'vulnerability': int(row.get('Vulnerability', 1)),
                        'sexuality': int(row.get('Sexuality', 1)),
                        'personalHistory': int(row.get('Personal History', 1)),
                        'humor': int(row.get('Humor', 1)),
                        'selfReflection': int(row.get('Self-Reflection', 1)),
                        'embarrassment': int(row.get('Embarrassment Potential', 1)),
                        'depth': int(row.get('Depth of Connection', 1)),
                        'conflict': int(row.get('Conflict Potential', 1))
                    }
                }
                
                # Skip empty questions
                if question_data['text'] and question_data['text'] != 'nan':
                    questions.append(question_data)
                    
            except (ValueError, KeyError) as e:
                print(f"Warning: Skipping malformed row {index + 1} in {csv_path}: {e}")
                continue
                
    except FileNotFoundError:
        print(f"Error: CSV file not found: {csv_path}")
        return []
    except Exception as e:
        print(f"Error reading CSV file {csv_path}: {e}")
        return []
    
    return questions

def convert_csv_to_json(csv_path, json_path):
    """Convert a single CSV file to JSON format."""
    print(f"Converting {csv_path} to {json_path}...")
    
    questions = parse_csv_file(csv_path)
    
    if not questions:
        print(f"No valid questions found in {csv_path}")
        return False
    
    # Create the JSON structure
    json_data = {
        'metadata': {
            'source': os.path.basename(csv_path),
            'totalQuestions': len(questions),
            'categories': [
                'vulnerability',
                'sexuality', 
                'personalHistory',
                'humor',
                'selfReflection',
                'embarrassment',
                'depth',
                'conflict'
            ]
        },
        'questions': questions
    }
    
    try:
        # Write JSON file
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        with open(json_path, 'w', encoding='utf-8') as file:
            json.dump(json_data, file, indent=2, ensure_ascii=False)
        
        print(f"Successfully converted {len(questions)} questions to {json_path}")
        return True
        
    except Exception as e:
        print(f"Error writing JSON file {json_path}: {e}")
        return False

def main():
    """Main function to process all CSV files in the decks directory."""
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    decks_dir = project_dir / 'decks'
    json_dir = project_dir / 'data'
    
    print(f"Looking for CSV files in: {decks_dir}")
    
    if not decks_dir.exists():
        print(f"Error: Decks directory not found: {decks_dir}")
        sys.exit(1)
    
    # Find all CSV files
    csv_files = list(decks_dir.glob('*.csv'))
    
    if not csv_files:
        print("No CSV files found in the decks directory.")
        sys.exit(1)
    
    print(f"Found {len(csv_files)} CSV file(s):")
    for csv_file in csv_files:
        print(f"  - {csv_file.name}")
    
    # Convert each CSV file
    successful_conversions = 0
    for csv_file in csv_files:
        # Create corresponding JSON filename
        json_filename = csv_file.stem + '.json'
        json_path = json_dir / json_filename
        
        if convert_csv_to_json(csv_file, json_path):
            successful_conversions += 1
    
    print(f"\nConversion complete: {successful_conversions}/{len(csv_files)} files converted successfully.")
    
    if successful_conversions > 0:
        print(f"JSON files saved to: {json_dir}")
        print("\nYou can now update your JavaScript to load JSON files instead of CSV.")

if __name__ == '__main__':
    main()
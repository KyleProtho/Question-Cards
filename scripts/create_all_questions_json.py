#!/usr/bin/env python3
"""
Script to combine all JSON files in the data/ directory into a single all_questions.json file.
This creates a unified dataset for the Question Cards application.
"""

import json
import os
from pathlib import Path

def combine_json_files():
    """Combine all JSON files from data/ directory into all_questions.json"""
    
    # Get the project root directory (parent of scripts/)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_dir = project_root / "data"
    output_file = project_root / "all_questions.json"
    
    combined_data = {
        "metadata": {
            "sources": [],
            "totalQuestions": 0,
            "categories": [
                "vulnerability",
                "sexuality", 
                "personalHistory",
                "humor",
                "selfReflection",
                "embarrassment",
                "depth",
                "conflict"
            ]
        },
        "questions": []
    }
    
    question_index = 1
    
    # Process each JSON file in the data directory
    for json_file in sorted(data_dir.glob("*.json")):
        print(f"Processing {json_file.name}...")
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add source to metadata
            combined_data["metadata"]["sources"].append({
                "filename": json_file.name,
                "source": data["metadata"]["source"],
                "originalQuestions": data["metadata"]["totalQuestions"]
            })
            
            # Add questions with updated indices
            for question in data["questions"]:
                question_copy = question.copy()
                question_copy["index"] = question_index
                question_copy["sourceFile"] = json_file.name
                combined_data["questions"].append(question_copy)
                question_index += 1
                
        except Exception as e:
            print(f"Error processing {json_file}: {e}")
            continue
    
    # Update total question count
    combined_data["metadata"]["totalQuestions"] = len(combined_data["questions"])
    
    # Write combined data to output file
    print(f"Writing combined data to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, indent=2, ensure_ascii=False)
    
    print(f"Successfully combined {len(combined_data['metadata']['sources'])} files")
    print(f"Total questions: {combined_data['metadata']['totalQuestions']}")
    print(f"Output saved to: {output_file}")

if __name__ == "__main__":
    combine_json_files()
import json
import re

def format_explanation(text):
    """
    Format explanation text to proper HTML with lists and paragraphs.
    """
    if not text:
        return text
    
    # Step 1: Normalize bullet points - replace various bullet characters
    text = text.replace('•', '•')  # Normalize bullet
    text = text.replace('◦', '◦')  # Normalize sub-bullet
    
    # Step 2: Split into lines and process
    lines = text.split('\n')
    formatted_lines = []
    in_list = False
    in_sublist = False
    current_paragraph = []
    
    for line in lines:
        stripped = line.strip()
        
        # Empty line - close lists and paragraphs
        if not stripped:
            if current_paragraph:
                formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_sublist:
                formatted_lines.append('</ul>')
                in_sublist = False
            if in_list:
                formatted_lines.append('</ul>')
                in_list = False
            continue
        
        # Main bullet point (•)
        if stripped.startswith('•'):
            if current_paragraph:
                formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_sublist:
                formatted_lines.append('</ul>')
                in_sublist = False
            if not in_list:
                formatted_lines.append('<ul>')
                in_list = True
            content = stripped[1:].strip()
            formatted_lines.append(f'<li>{content}</li>')
        
        # Sub bullet point (◦)
        elif stripped.startswith('◦'):
            if current_paragraph:
                formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if not in_sublist:
                if not in_list:
                    formatted_lines.append('<ul>')
                    in_list = True
                formatted_lines.append('<ul>')
                in_sublist = True
            content = stripped[1:].strip()
            formatted_lines.append(f'<li>{content}</li>')
        
        # Choice pattern - start new paragraph
        elif re.match(r'\(Choice [A-F]\)', stripped):
            if current_paragraph:
                formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_sublist:
                formatted_lines.append('</ul>')
                in_sublist = False
            if in_list:
                formatted_lines.append('</ul>')
                in_list = False
            
            # Extract choice letter and content
            match = re.match(r'\(Choice ([A-F])\)\s*(.*)', stripped)
            if match:
                choice_letter = match.group(1)
                choice_content = match.group(2)
                formatted_lines.append(f'<p><strong>Choice {choice_letter}:</strong> {choice_content}</p>')
        
        # Educational Objective
        elif re.match(r'Educational [Oo]bjective:?', stripped):
            if current_paragraph:
                formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
                current_paragraph = []
            if in_sublist:
                formatted_lines.append('</ul>')
                in_sublist = False
            if in_list:
                formatted_lines.append('</ul>')
                in_list = False
            
            content = re.sub(r'Educational [Oo]bjective:?\s*', '', stripped)
            formatted_lines.append(f'<p class="educational-objective"><strong>Educational Objective:</strong> {content}</p>')
        
        # Regular text - accumulate in paragraph
        else:
            if in_sublist:
                formatted_lines.append('</ul>')
                in_sublist = False
            if in_list:
                formatted_lines.append('</ul>')
                in_list = False
            current_paragraph.append(stripped)
    
    # Close any remaining open elements
    if current_paragraph:
        formatted_lines.append('<p>' + ' '.join(current_paragraph) + '</p>')
    if in_sublist:
        formatted_lines.append('</ul>')
    if in_list:
        formatted_lines.append('</ul>')
    
    result = '\n'.join(formatted_lines)
    
    # Clean up any issues
    result = re.sub(r'\n\n+', '\n', result)
    
    return result


def main():
    # Load the questions
    input_file = 'usmle_questions.json'
    output_file = 'usmle_questions.json'
    
    print(f"Loading questions from {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"Processing {len(questions)} questions...")
    
    # Format explanations
    for i, question in enumerate(questions):
        if 'explanation' in question and question['explanation']:
            question['explanation'] = format_explanation(question['explanation'])
        
        if (i + 1) % 500 == 0:
            print(f"Processed {i + 1} questions...")
    
    # Save back to file
    print(f"Saving formatted questions to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print("Done! Explanations have been formatted.")


if __name__ == '__main__':
    main()

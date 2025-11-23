import os
import json
import re
from bs4 import BeautifulSoup
import glob

def clean_text(text):
    if not text:
        return ""
    # Use separator to avoid merging words when tags are adjacent
    return re.sub(r'\s+', ' ', text).strip()

def load_topics_map(topics_file):
    with open(topics_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip JS assignment
    content = content.replace('const topics =', '').strip().rstrip(';')
    
    # Quote unquoted keys (simple words followed by colon)
    # Look for word characters followed by colon, not preceded by quote
    content = re.sub(r'(?<!")\b([a-zA-Z_]\w*)\s*:', r'"\1":', content)
    
    # Remove trailing commas
    content = re.sub(r',\s*([\]}])', r'\1', content)
    
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"Error parsing topics.js: {e}")
        return {}

    # Flatten the map: question_id -> {system, topic}
    id_map = {}
    for system, topics in data.items():
        for topic, ids in topics.items():
            for q_id in ids:
                id_map[str(q_id)] = {'system': system, 'topic': topic}
    return id_map

def parse_html_file(file_path, topics_map=None):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    
    # Extract ID from filename
    file_name = os.path.basename(file_path)
    question_id = file_name.replace('.html', '')

    # Question Text
    question_text = ""
    summary = soup.find('summary')
    if summary:
        first_p = summary.find_next_sibling('p')
        if first_p:
            question_text = clean_text(first_p.get_text(separator=' '))
    
    # Options
    options = []
    options_table = None
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        if not rows:
            continue
        first_row = rows[0]
        cells = first_row.find_all('td')
        if cells and clean_text(cells[0].get_text()) == 'A.':
            options_table = table
            break
    
    if options_table:
        for row in options_table.find_all('tr'):
            cells = row.find_all('td')
            if len(cells) >= 2:
                option_char = clean_text(cells[0].get_text()).replace('.', '')
                option_text = clean_text(cells[1].get_text(separator=' '))
                options.append({
                    'option': option_char,
                    'text': option_text
                })

    # Correct Answer
    correct_answer = ""
    correct_p = soup.find('p', string=re.compile(r'Correct answer\s+[A-Z]'))
    if correct_p:
        match = re.search(r'Correct answer\s+([A-Z])', correct_p.get_text())
        if match:
            correct_answer = match.group(1)
    
    if not correct_answer:
        # Fallback: Look for "X% Answered correctly" and match with option percentage
        # This happens when the user answered correctly and the explicit text is hidden
        # Iterate over all p tags to find the stats
        for p in soup.find_all('p'):
            text = clean_text(p.get_text(separator=' '))
            if "Answered correctly" in text:
                match = re.search(r'(\d+)%\s*Answered correctly', text)
                if match:
                    correct_percent = match.group(1)
                    
                    # Find the option with this percentage in the submit table
                    for table in tables:
                        # Check if this table has percentages in the text
                        if table.find(string=re.compile(r'\(\d+%\)')):
                            for row in table.find_all('tr'):
                                cells = row.find_all('td')
                                if len(cells) >= 2:
                                    option_char = clean_text(cells[0].get_text()).replace('.', '')
                                    option_text = clean_text(cells[1].get_text(separator=' '))
                                    # Check if option text contains the percentage
                                    if f"({correct_percent}%)" in option_text:
                                        correct_answer = option_char
                                        break
                            if correct_answer:
                                break
            if correct_answer:
                break

    # Explanation
    explanation = ""
    explanation_start = soup.find(string="Explanation")
    if explanation_start:
        current = explanation_start.find_parent('ul')
        if not current:
             current = explanation_start.find_parent('p')
        
        if current:
            next_elem = current.find_next_sibling()
            while next_elem:
                text = next_elem.get_text(separator=' ')
                if "Educational objective" in text or "Subspecialty" in text or "Subject" in text:
                    break
                explanation += clean_text(text) + "\n"
                next_elem = next_elem.find_next_sibling()

    # Metadata
    def get_metadata(label):
        label_elem = soup.find('p', string=label)
        if label_elem:
            value_elem = label_elem.find_next_sibling('p')
            if value_elem:
                return clean_text(value_elem.get_text(separator=' '))
        return ""

    subject = get_metadata("Subject")
    
    # Use topics map if available, otherwise fallback to HTML metadata
    system = ""
    topic = ""
    
    if topics_map and question_id in topics_map:
        system = topics_map[question_id]['system']
        topic = topics_map[question_id]['topic']
    else:
        system = get_metadata("System")
        topic = get_metadata("Topic")

    return {
        "id": question_id,
        "question": question_text,
        "options": options,
        "correct_answer": correct_answer,
        "explanation": explanation.strip(),
        "subject": subject,
        "system": system,
        "topic": topic,
        "file_path": file_path
    }

def main():
    questions_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = glob.glob(os.path.join(questions_dir, "*.html"))
    
    all_data = []
    missing_answers = []
    
    print(f"Found {len(html_files)} HTML files.")
    
    # Load topics map
    topics_file = os.path.join(questions_dir, "topics.js")
    topics_map = {}
    if os.path.exists(topics_file):
        print(f"Loading topics from {topics_file}...")
        topics_map = load_topics_map(topics_file)
        print(f"Loaded {len(topics_map)} questions from topics map.")
    else:
        print("Warning: topics.js not found.")

    # Run on all files
    # html_files = html_files[:50] 
    
    for i, file_path in enumerate(html_files):
        if i % 100 == 0:
            print(f"Processing {i}/{len(html_files)}...")
        
        try:
            data = parse_html_file(file_path, topics_map)
            if data['correct_answer']:
                all_data.append(data)
            else:
                missing_answers.append(data['id'])
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    output_file = os.path.join(questions_dir, "usmle_questions.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(all_data)} questions to {output_file}")
    print(f"Ignored {len(missing_answers)} questions with missing answers.")
    if missing_answers:
        print(f"Ignored IDs: {missing_answers}")

if __name__ == "__main__":
    main()

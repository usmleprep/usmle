import json

# Load questions
with open('usmle_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Find the problematic question
for q in questions:
    if q['id'] == '1-test':
        print(f"Before fix:")
        print(f"  ID: {q['id']}")
        print(f"  System: {q.get('system', 'N/A')}")
        print(f"  Topic: {q.get('topic', 'N/A')}")
        
        # The system and topic are swapped
        # System should be from topics.js, topic is the specific condition
        # In this case, "Poststreptococcal Glomerulonephritis" is the topic
        # We need to find the correct system
        
        # Based on the topic, this should be under Renal system
        q['system'] = 'Renal'
        q['topic'] = 'Poststreptococcal Glomerulonephritis'
        
        print(f"\nAfter fix:")
        print(f"  ID: {q['id']}")
        print(f"  System: {q['system']}")
        print(f"  Topic: {q['topic']}")
        break

# Save back
with open('usmle_questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("\nFixed and saved!")

import json

with open('usmle_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total = len(data)
has_topic = 0
has_system = 0
has_copyright = 0
empty_topic = 0

for q in data:
    if q.get('topic'):
        has_topic += 1
        if "Copyright" in q['topic']:
            has_copyright += 1
            print(f"ID with Copyright: {q['id']}")
    else:
        empty_topic += 1
        
    if q.get('system'):
        has_system += 1

print(f"Total questions: {total}")
print(f"With System: {has_system} ({has_system/total:.1%})")
print(f"With Topic: {has_topic} ({has_topic/total:.1%})")
print(f"With 'Copyright' in Topic: {has_copyright}")
print(f"Empty Topic: {empty_topic}")

import json

# Read the questions JSON
with open('web_app/public/data/usmle_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Convert to JavaScript
questions_js = json.dumps(questions, ensure_ascii=False)

# HTML template
html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USMLE Question Bank</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
        }

        .login-box {
            background: white;
            border-radius: 16px;
            padding: 3rem;
            max-width: 450px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .login-box h1 {
            font-size: 2.2rem;
            margin-bottom: 0.5rem;
            color: #1a202c;
            text-align: center;
        }

        .login-box p {
            color: #718096;
            text-align: center;
            margin-bottom: 2rem;
        }

        .login-box input {
            width: 100%;
            padding: 0.875rem;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .login-box input:focus {
            outline: none;
            border-color: #667eea;
        }

        .login-box button {
            width: 100%;
            padding: 1rem;
            border-radius: 8px;
            border: none;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .login-box button:hover {
            transform: translateY(-2px);
        }

        .error {
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: -1rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .app-container {
            display: none;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .app-header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .app-header h1 {
            color: #1a202c;
            margin-bottom: 0.5rem;
        }

        .app-header .stats {
            color: #718096;
            display: flex;
            gap: 2rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }

        .question-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
        }

        .question-meta {
            font-size: 0.9rem;
            color: #718096;
        }

        .question-text {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #2d3748;
            margin-bottom: 1.5rem;
            white-space: pre-wrap;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .option {
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .option:hover {
            border-color: #667eea;
            background: #f7fafc;
        }

        .option.selected {
            border-color: #667eea;
            background: #edf2f7;
        }

        .option.correct {
            border-color: #48bb78;
            background: #f0fff4;
        }

        .option.incorrect {
            border-color: #f56565;
            background: #fff5f5;
        }

        .controls {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #2d3748;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .explanation {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            display: none;
        }

        .explanation.show {
            display: block;
        }

        .explanation h3 {
            margin-bottom: 1rem;
            color: #2d3748;
        }

        .logout-btn {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem 1rem;
            background: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            color: #667eea;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        @media (max-width: 768px) {
            .app-container {
                padding: 1rem;
            }
            
            .question-card {
                padding: 1.5rem;
            }
            
            .controls {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="login-container" id="loginScreen">
        <div class="login-box">
            <h1>USMLE Question Bank</h1>
            <p>Enter password to access</p>
            <input type="password" id="passwordInput" placeholder="Password" />
            <div class="error" id="errorMsg"></div>
            <button onclick="login()">Login</button>
        </div>
    </div>

    <div class="app-container" id="appScreen">
        <button class="logout-btn" onclick="logout()">Logout</button>
        
        <div class="app-header">
            <h1>USMLE Question Bank</h1>
            <div class="stats">
                <span>Total Questions: <strong id="totalQuestions">0</strong></span>
                <span>Current: <strong id="currentQuestion">1</strong></span>
                <span>Subject: <strong id="currentSubject">-</strong></span>
            </div>
        </div>

        <div class="question-card">
            <div class="question-header">
                <div class="question-meta">
                    <div><strong>ID:</strong> <span id="questionId">-</span></div>
                    <div><strong>System:</strong> <span id="questionSystem">-</span></div>
                </div>
            </div>
            <div class="question-text" id="questionText">Loading questions...</div>
            <div class="options" id="optionsContainer"></div>
            <div class="controls">
                <button class="btn btn-secondary" onclick="previousQuestion()">← Previous</button>
                <button class="btn btn-primary" onclick="submitAnswer()" id="submitBtn">Check Answer</button>
                <button class="btn btn-secondary" onclick="nextQuestion()">Next →</button>
            </div>
            <div class="explanation" id="explanation"></div>
        </div>
    </div>

    <script>
        const PASSWORD = 'usmle2025';
        const questions = QUESTIONS_DATA_PLACEHOLDER;
        let currentIndex = 0;
        let selectedOption = null;
        let answered = false;

        function login() {
            const password = document.getElementById('passwordInput').value;
            if (password === PASSWORD) {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('appScreen').style.display = 'block';
                initializeApp();
            } else {
                document.getElementById('errorMsg').textContent = 'Incorrect password!';
            }
        }

        function logout() {
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('appScreen').style.display = 'none';
            document.getElementById('passwordInput').value = '';
            document.getElementById('errorMsg').textContent = '';
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('passwordInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') login();
            });
        });

        function initializeApp() {
            document.getElementById('totalQuestions').textContent = questions.length;
            displayQuestion();
        }

        function displayQuestion() {
            if (questions.length === 0) return;

            const question = questions[currentIndex];
            selectedOption = null;
            answered = false;

            document.getElementById('currentQuestion').textContent = currentIndex + 1;
            document.getElementById('questionId').textContent = question.id || '-';
            document.getElementById('questionSystem').textContent = question.system || '-';
            document.getElementById('currentSubject').textContent = question.subject || '-';
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('explanation').classList.remove('show');
            document.getElementById('submitBtn').textContent = 'Check Answer';

            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';

            question.options.forEach((opt, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `<strong>${opt.option}.</strong> ${opt.text}`;
                optionDiv.onclick = () => selectOption(index);
                optionsContainer.appendChild(optionDiv);
            });
        }

        function selectOption(index) {
            if (answered) return;

            selectedOption = index;
            const options = document.querySelectorAll('.option');
            options.forEach((opt, i) => {
                opt.classList.remove('selected');
                if (i === index) opt.classList.add('selected');
            });
        }

        function submitAnswer() {
            if (selectedOption === null || answered) return;

            answered = true;
            const question = questions[currentIndex];
            const options = document.querySelectorAll('.option');

            options.forEach((opt, i) => {
                const optionLetter = question.options[i].option;
                if (optionLetter === question.correct_answer) {
                    opt.classList.add('correct');
                } else if (i === selectedOption) {
                    opt.classList.add('incorrect');
                }
            });

            const explanationDiv = document.getElementById('explanation');
            const explanationText = question.explanation || 'No explanation available.';
            explanationDiv.innerHTML = `<h3>Explanation:</h3><div>${explanationText}</div>`;
            explanationDiv.classList.add('show');
            
            document.getElementById('submitBtn').textContent = 'Answer Checked';
        }

        function nextQuestion() {
            if (currentIndex < questions.length - 1) {
                currentIndex++;
                displayQuestion();
            }
        }

        function previousQuestion() {
            if (currentIndex > 0) {
                currentIndex--;
                displayQuestion();
            }
        }
    </script>
</body>
</html>'''

# Replace placeholder with actual data
html_content = html_template.replace('QUESTIONS_DATA_PLACEHOLDER', questions_js)

# Write to file
with open('USMLE_Standalone.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Standalone HTML created successfully!")
print(f"Total questions: {len(questions)}")
print("File: USMLE_Standalone.html")
print("Password: usmle2025")

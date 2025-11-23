import json

# Read the questions JSON
with open('web_app/public/data/usmle_questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Convert to JavaScript
questions_js = json.dumps(questions, ensure_ascii=False)

# Full HTML with all features
html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USMLE Question Bank</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        /* Login Screen */
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

        .login-box button:hover { transform: translateY(-2px); }

        .error {
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: -1rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        /* App Container */
        .app-container {
            display: none;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        .app-header {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .app-header h1 { color: #1a202c; }

        .nav-buttons {
            display: flex;
            gap: 1rem;
        }

        .nav-btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            background: #e2e8f0;
            color: #2d3748;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .nav-btn:hover { background: #cbd5e0; }
        .nav-btn.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }

        /* Dashboard */
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .stat-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-card h3 {
            color: #718096;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }

        .stat-card .value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #667eea;
        }

        /* Create Test */
        .create-test-form {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2d3748;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 0.75rem;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
            font-size: 1rem;
        }

        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 0.5rem;
            max-height: 300px;
            overflow-y: auto;
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
        }

        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: normal;
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

        .btn:hover { transform: translateY(-2px); }

        /* Test Interface */
        .test-container {
            display: grid;
            grid-template-columns: 5vw 1fr;
            gap: 2rem;
        }

        .sidebar {
            background: white;
            padding: 1rem 0.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            height: fit-content;
            position: sticky;
            top: 2rem;
        }

        .sidebar-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.5rem;
        }

        .q-btn {
            width: 100%;
            aspect-ratio: 1;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.2s;
        }

        .q-btn:hover { border-color: #667eea; }
        .q-btn.current { background: #667eea; color: white; }
        .q-btn.answered { background: #edf2f7; }
        .q-btn.marked { border-color: #f59e0b; background: #fef3c7; }

        .question-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e2e8f0;
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
            margin-bottom: 2rem;
        }

        .option {
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .option:hover { border-color: #667eea; background: #f7fafc; }
        .option.selected { border-color: #667eea; background: #edf2f7; }
        .option.correct { border-color: #48bb78; background: #f0fff4; }
        .option.incorrect { border-color: #f56565; background: #fff5f5; }
        .option.disabled { cursor: not-allowed; opacity: 0.6; }

        .controls {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .explanation {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            display: none;
        }

        .explanation.show { display: block; }
        .explanation h3 { margin-bottom: 1rem; color: #2d3748; }

        /* Test History */
        .history-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .history-item {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .history-info h3 { color: #2d3748; margin-bottom: 0.5rem; }
        .history-info p { color: #718096; font-size: 0.9rem; }

        .history-actions {
            display: flex;
            gap: 0.5rem;
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
            z-index: 1000;
        }

        .hidden { display: none !important; }

        @media (max-width: 768px) {
            .test-container { grid-template-columns: 1fr; }
            .sidebar { display: none; }
        }
    </style>
</head>
<body>
    <!-- Login Screen -->
    <div class="login-container" id="loginScreen">
        <div class="login-box">
            <h1>USMLE Question Bank</h1>
            <p>Enter password to access</p>
            <input type="password" id="passwordInput" placeholder="Password" />
            <div class="error" id="errorMsg"></div>
            <button onclick="login()">Login</button>
        </div>
    </div>

    <!-- App Screen -->
    <div class="app-container" id="appScreen">
        <button class="logout-btn" onclick="logout()">Logout</button>
        
        <div class="app-header">
            <h1>USMLE Question Bank</h1>
            <div class="nav-buttons">
                <button class="nav-btn active" onclick="showView('dashboard')">Dashboard</button>
                <button class="nav-btn" onclick="showView('create')">Create Test</button>
                <button class="nav-btn" onclick="showView('history')">History</button>
            </div>
        </div>

        <!-- Dashboard View -->
        <div id="dashboardView" class="view">
            <div class="dashboard">
                <div class="stat-card">
                    <h3>Total Questions</h3>
                    <div class="value" id="totalQuestionsCount">0</div>
                </div>
                <div class="stat-card">
                    <h3>Tests Completed</h3>
                    <div class="value" id="testsCompleted">0</div>
                </div>
                <div class="stat-card">
                    <h3>Questions Answered</h3>
                    <div class="value" id="questionsAnswered">0</div>
                </div>
                <div class="stat-card">
                    <h3>Average Score</h3>
                    <div class="value" id="avgScore">0%</div>
                </div>
            </div>
        </div>

        <!-- Create Test View -->
        <div id="createView" class="view hidden">
            <div class="create-test-form">
                <h2 style="margin-bottom: 1.5rem;">Create New Test</h2>
                
                <div class="form-group">
                    <label>Number of Questions</label>
                    <input type="number" id="questionCount" value="40" min="1" max="200" />
                </div>

                <div class="form-group">
                    <label>Test Mode</label>
                    <select id="testMode">
                        <option value="tutor">Tutor Mode (Immediate feedback)</option>
                        <option value="test">Test Mode (Feedback at end)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Filter by System</label>
                    <div class="checkbox-group" id="systemFilters"></div>
                </div>

                <button class="btn btn-primary" onclick="startTest()">Start Test</button>
            </div>
        </div>

        <!-- Test View -->
        <div id="testView" class="view hidden">
            <div class="test-container">
                <div class="sidebar">
                    <div class="sidebar-grid" id="sidebarGrid"></div>
                </div>
                <div class="question-card">
                    <div class="question-header">
                        <div>
                            <strong>Question <span id="currentQ">1</span> of <span id="totalQ">40</span></strong>
                            <div style="font-size: 0.9rem; color: #718096; margin-top: 0.25rem;">
                                <span id="questionSystem">-</span> | <span id="questionTopic">-</span>
                            </div>
                        </div>
                        <button class="btn btn-secondary" onclick="toggleMark()">
                            <span id="markText">Mark</span>
                        </button>
                    </div>
                    <div class="question-text" id="testQuestionText"></div>
                    <div class="options" id="testOptions"></div>
                    <div class="controls">
                        <button class="btn btn-secondary" onclick="prevTestQuestion()">← Previous</button>
                        <button class="btn btn-primary" id="submitTestBtn" onclick="submitTestAnswer()">Submit</button>
                        <button class="btn btn-secondary" onclick="nextTestQuestion()">Next →</button>
                        <button class="btn btn-secondary" onclick="suspendTest()">Suspend Test</button>
                        <button class="btn btn-primary" onclick="endTest()">End Test</button>
                    </div>
                    <div class="explanation" id="testExplanation"></div>
                </div>
            </div>
        </div>

        <!-- History View -->
        <div id="historyView" class="view hidden">
            <div class="history-list" id="historyList">
                <p style="text-align: center; color: #718096;">No tests completed yet</p>
            </div>
        </div>
    </div>

    <script>
        const PASSWORD = 'usmle2025';
        const ALL_QUESTIONS = ''' + questions_js + ''';
        
        let currentView = 'dashboard';
        let currentTest = null;
        let testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        let questionStats = JSON.parse(localStorage.getItem('questionStats') || '{}');

        // Login
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

        // Initialize App
        function initializeApp() {
            updateDashboard();
            populateSystemFilters();
            updateHistory();
            
            // Check for suspended test
            const suspended = localStorage.getItem('suspendedTest');
            if (suspended) {
                if (confirm('You have a suspended test. Do you want to resume it?')) {
                    currentTest = JSON.parse(suspended);
                    showView('test');
                    displayTestQuestion();
                } else {
                    localStorage.removeItem('suspendedTest');
                }
            }
        }

        // View Management
        function showView(view) {
            currentView = view;
            document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            
            if (view === 'dashboard') {
                document.getElementById('dashboardView').classList.remove('hidden');
                document.querySelector('[onclick="showView(\'dashboard\')"]').classList.add('active');
                updateDashboard();
            } else if (view === 'create') {
                document.getElementById('createView').classList.remove('hidden');
                document.querySelector('[onclick="showView(\'create\')"]').classList.add('active');
            } else if (view === 'history') {
                document.getElementById('historyView').classList.remove('hidden');
                document.querySelector('[onclick="showView(\'history\')"]').classList.add('active');
                updateHistory();
            } else if (view === 'test') {
                document.getElementById('testView').classList.remove('hidden');
            }
        }

        // Dashboard
        function updateDashboard() {
            document.getElementById('totalQuestionsCount').textContent = ALL_QUESTIONS.length;
            document.getElementById('testsCompleted').textContent = testHistory.length;
            
            const answered = Object.keys(questionStats).length;
            document.getElementById('questionsAnswered').textContent = answered;
            
            if (testHistory.length > 0) {
                const avgScore = testHistory.reduce((sum, t) => sum + t.score, 0) / testHistory.length;
                document.getElementById('avgScore').textContent = Math.round(avgScore) + '%';
            }
        }

        // Create Test
        function populateSystemFilters() {
            const systems = [...new Set(ALL_QUESTIONS.map(q => q.system).filter(s => s))];
            const container = document.getElementById('systemFilters');
            container.innerHTML = systems.map(sys => `
                <label>
                    <input type="checkbox" value="${sys}" checked />
                    ${sys}
                </label>
            `).join('');
        }

        function startTest() {
            const count = parseInt(document.getElementById('questionCount').value);
            const mode = document.getElementById('testMode').value;
            const selectedSystems = Array.from(document.querySelectorAll('#systemFilters input:checked'))
                .map(cb => cb.value);
            
            let filtered = ALL_QUESTIONS.filter(q => selectedSystems.includes(q.system));
            filtered = filtered.sort(() => Math.random() - 0.5).slice(0, count);
            
            currentTest = {
                id: Date.now(),
                mode: mode,
                questions: filtered,
                currentIndex: 0,
                answers: {},
                marked: {},
                startTime: Date.now()
            };
            
            showView('test');
            initializeSidebar();
            displayTestQuestion();
        }

        // Test Interface
        function initializeSidebar() {
            const grid = document.getElementById('sidebarGrid');
            grid.innerHTML = currentTest.questions.map((_, i) => 
                `<button class="q-btn" onclick="jumpToQuestion(${i})">${i + 1}</button>`
            ).join('');
            updateSidebar();
        }

        function updateSidebar() {
            const buttons = document.querySelectorAll('.q-btn');
            buttons.forEach((btn, i) => {
                btn.classList.remove('current', 'answered', 'marked');
                if (i === currentTest.currentIndex) btn.classList.add('current');
                if (currentTest.answers[i] !== undefined) btn.classList.add('answered');
                if (currentTest.marked[i]) btn.classList.add('marked');
            });
        }

        function displayTestQuestion() {
            const q = currentTest.questions[currentTest.currentIndex];
            const idx = currentTest.currentIndex;
            
            document.getElementById('currentQ').textContent = idx + 1;
            document.getElementById('totalQ').textContent = currentTest.questions.length;
            document.getElementById('questionSystem').textContent = q.system || '-';
            document.getElementById('questionTopic').textContent = q.topic || '-';
            document.getElementById('testQuestionText').textContent = q.question;
            document.getElementById('markText').textContent = currentTest.marked[idx] ? 'Unmark' : 'Mark';
            
            const optionsContainer = document.getElementById('testOptions');
            optionsContainer.innerHTML = q.options.map((opt, i) => `
                <div class="option ${currentTest.answers[idx] === i ? 'selected' : ''}" 
                     onclick="selectTestOption(${i})">
                    <strong>${opt.option}.</strong> ${opt.text}
                </div>
            `).join('');
            
            document.getElementById('testExplanation').classList.remove('show');
            updateSidebar();
            
            // Show explanation if already answered in tutor mode
            if (currentTest.mode === 'tutor' && currentTest.answers[idx] !== undefined) {
                showTestExplanation();
            }
        }

        function selectTestOption(index) {
            const idx = currentTest.currentIndex;
            if (currentTest.mode === 'tutor' && currentTest.answers[idx] !== undefined) return;
            
            currentTest.answers[idx] = index;
            displayTestQuestion();
        }

        function submitTestAnswer() {
            const idx = currentTest.currentIndex;
            if (currentTest.answers[idx] === undefined) {
                alert('Please select an answer');
                return;
            }
            
            if (currentTest.mode === 'tutor') {
                showTestExplanation();
            }
            updateSidebar();
        }

        function showTestExplanation() {
            const q = currentTest.questions[currentTest.currentIndex];
            const idx = currentTest.currentIndex;
            const selected = currentTest.answers[idx];
            
            const options = document.querySelectorAll('#testOptions .option');
            options.forEach((opt, i) => {
                const optLetter = q.options[i].option;
                if (optLetter === q.correct_answer) {
                    opt.classList.add('correct');
                } else if (i === selected) {
                    opt.classList.add('incorrect');
                }
                opt.classList.add('disabled');
            });
            
            const exp = document.getElementById('testExplanation');
            exp.innerHTML = `<h3>Explanation:</h3><div>${q.explanation || 'No explanation available.'}</div>`;
            exp.classList.add('show');
        }

        function toggleMark() {
            const idx = currentTest.currentIndex;
            currentTest.marked[idx] = !currentTest.marked[idx];
            displayTestQuestion();
        }

        function prevTestQuestion() {
            if (currentTest.currentIndex > 0) {
                currentTest.currentIndex--;
                displayTestQuestion();
            }
        }

        function nextTestQuestion() {
            if (currentTest.currentIndex < currentTest.questions.length - 1) {
                currentTest.currentIndex++;
                displayTestQuestion();
            }
        }

        function jumpToQuestion(index) {
            currentTest.currentIndex = index;
            displayTestQuestion();
        }

        function suspendTest() {
            if (confirm('Suspend this test? You can resume it later.')) {
                localStorage.setItem('suspendedTest', JSON.stringify(currentTest));
                showView('dashboard');
            }
        }

        function endTest() {
            if (!confirm('End test and see results?')) return;
            
            let correct = 0;
            currentTest.questions.forEach((q, i) => {
                if (currentTest.answers[i] !== undefined) {
                    const selected = q.options[currentTest.answers[i]].option;
                    if (selected === q.correct_answer) correct++;
                    
                    // Update question stats
                    if (!questionStats[q.id]) questionStats[q.id] = { attempts: 0, correct: 0 };
                    questionStats[q.id].attempts++;
                    if (selected === q.correct_answer) questionStats[q.id].correct++;
                }
            });
            
            const score = Math.round((correct / currentTest.questions.length) * 100);
            
            testHistory.push({
                id: currentTest.id,
                date: new Date().toISOString(),
                mode: currentTest.mode,
                total: currentTest.questions.length,
                answered: Object.keys(currentTest.answers).length,
                correct: correct,
                score: score,
                questions: currentTest.questions,
                answers: currentTest.answers
            });
            
            localStorage.setItem('testHistory', JSON.stringify(testHistory));
            localStorage.setItem('questionStats', JSON.stringify(questionStats));
            localStorage.removeItem('suspendedTest');
            
            alert(`Test Complete!\\n\\nScore: ${score}%\\nCorrect: ${correct}/${currentTest.questions.length}`);
            
            currentTest = null;
            showView('history');
        }

        // History
        function updateHistory() {
            const container = document.getElementById('historyList');
            if (testHistory.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #718096;">No tests completed yet</p>';
                return;
            }
            
            container.innerHTML = testHistory.slice().reverse().map(test => `
                <div class="history-item">
                    <div class="history-info">
                        <h3>Test #${test.id}</h3>
                        <p>${new Date(test.date).toLocaleString()} | ${test.mode} mode</p>
                        <p>Score: ${test.score}% (${test.correct}/${test.total})</p>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn-primary" onclick="reviewTest(${test.id})">Review</button>
                    </div>
                </div>
            `).join('');
        }

        function reviewTest(testId) {
            const test = testHistory.find(t => t.id === testId);
            currentTest = {
                ...test,
                currentIndex: 0,
                mode: 'review'
            };
            showView('test');
            initializeSidebar();
            displayTestQuestion();
            showTestExplanation();
        }
    </script>
</body>
</html>'''

# Write to file
output_file = 'USMLE_Complete.html'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Complete standalone HTML created successfully!")
print(f"Total questions: {len(questions)}")
print(f"File: {output_file}")
print("Password: usmle2025")
print("")
print("Features included:")
print("- Dashboard with statistics")
print("- Create custom tests with filters")
print("- Tutor mode and Test mode")
print("- Question sidebar navigation")
print("- Mark questions")
print("- Suspend/Resume tests")
print("- Test history and review")
print("- Progress tracking")

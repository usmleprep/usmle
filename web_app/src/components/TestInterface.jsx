import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionSidebar from './QuestionSidebar';
import { toggleQuestionFlag, updateQuestionPerformance } from '../utils/questionTracker';

const TestInterface = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { questions, config, resumeData } = location.state || {};

    const [currentIndex, setCurrentIndex] = useState(resumeData?.currentIndex || 0);
    const [userAnswers, setUserAnswers] = useState(resumeData?.userAnswers || {});
    const [showExplanation, setShowExplanation] = useState(resumeData?.showExplanation || {});
    const [flags, setFlags] = useState(resumeData?.flags || {});
    const [timeElapsed, setTimeElapsed] = useState(resumeData?.timeElapsed || 0);
    const [testStartTime] = useState(resumeData?.testStartTime || Date.now());
    const [testId] = useState(resumeData?.testId || Date.now().toString());

    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/create-test');
            return;
        }

        const timer = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - testStartTime) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [questions, navigate, testStartTime]);

    if (!questions || questions.length === 0) {
        return null;
    }

    const currentQuestion = questions[currentIndex];
    const isTutored = config.mode === 'tutored';
    const hasAnswered = userAnswers[currentIndex] !== undefined;
    const isLastQuestion = currentIndex === questions.length - 1;
    const isFlagged = flags[currentIndex] || false;
    const showingExplanation = showExplanation[currentIndex];

    const handleAnswerSelect = (optionLetter) => {
        // Allow changing answer until explanation is shown
        if (isTutored && showingExplanation) return;

        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: optionLetter
        }));
    };

    const handleSubmitAnswer = () => {
        if (!hasAnswered) {
            alert("Please select an answer first.");
            return;
        }

        if (isTutored) {
            setShowExplanation(prev => ({ ...prev, [currentIndex]: true }));
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            handleFinishTest();
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleQuestionClick = (index) => {
        setCurrentIndex(index);
    };

    const handleToggleFlag = () => {
        setFlags(prev => ({
            ...prev,
            [currentIndex]: !prev[currentIndex]
        }));
        toggleQuestionFlag(currentQuestion.id);
    };

    const handleSuspendTest = () => {
        const answeredCount = Object.keys(userAnswers).length;

        const testData = {
            id: testId,
            date: new Date().toISOString(),
            status: 'suspended',
            mode: config.mode,
            timing: config.timing,
            duration: timeElapsed,
            currentIndex,
            totalQuestions: questions.length,
            answeredCount,
            questions: questions.map((q, idx) => ({
                ...q,
                userAnswer: userAnswers[idx],
                flagged: flags[idx] || false,
                answered: userAnswers[idx] !== undefined
            })),
            userAnswers,
            showExplanation,
            flags,
            testStartTime,
            config
        };

        const existingTests = JSON.parse(localStorage.getItem('testHistory') || '[]');
        const existingIndex = existingTests.findIndex(t => t.id === testId);

        if (existingIndex >= 0) {
            existingTests[existingIndex] = testData;
        } else {
            existingTests.push(testData);
        }

        localStorage.setItem('testHistory', JSON.stringify(existingTests));
        navigate('/history');
    };

    const handleFinishTest = () => {
        const unansweredCount = questions.length - Object.keys(userAnswers).length;

        let confirmMessage = 'Are you sure you want to finalize this test?\n\n';

        if (unansweredCount > 0) {
            confirmMessage += `⚠️ You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}.\n\n`;
        }

        confirmMessage += 'Once finalized, you cannot change your answers.';

        const confirmed = window.confirm(confirmMessage);

        if (!confirmed) {
            return;
        }

        const answeredQuestions = questions.filter((_, idx) => userAnswers[idx] !== undefined);
        const correctCount = answeredQuestions.reduce((count, q) => {
            const idx = questions.indexOf(q);
            return count + (userAnswers[idx] === q.correct_answer ? 1 : 0);
        }, 0);

        const score = answeredQuestions.length > 0
            ? Math.round((correctCount / answeredQuestions.length) * 100)
            : 0;

        // Only update performance for answered questions
        questions.forEach((q, idx) => {
            if (userAnswers[idx] !== undefined) {
                const isCorrect = userAnswers[idx] === q.correct_answer;
                updateQuestionPerformance(q.id, isCorrect);
            }
        });

        const testResult = {
            id: testId,
            date: new Date().toISOString(),
            status: 'completed',
            score,
            correctCount,
            totalQuestions: questions.length,
            answeredCount: answeredQuestions.length,
            mode: config.mode,
            timing: config.timing,
            duration: timeElapsed,
            questions: questions.map((q, idx) => ({
                ...q,
                userAnswer: userAnswers[idx],
                isCorrect: userAnswers[idx] === q.correct_answer,
                flagged: flags[idx] || false,
                answered: userAnswers[idx] !== undefined
            }))
        };

        const existingTests = JSON.parse(localStorage.getItem('testHistory') || '[]');
        const existingIndex = existingTests.findIndex(t => t.id === testId);

        if (existingIndex >= 0) {
            existingTests[existingIndex] = testResult;
        } else {
            existingTests.push(testResult);
        }

        localStorage.setItem('testHistory', JSON.stringify(existingTests));
        navigate(`/review/${testResult.id}`);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isCorrect = userAnswers[currentIndex] === currentQuestion.correct_answer;
    const answeredCount = Object.keys(userAnswers).length;

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar - Left */}
            <QuestionSidebar
                questions={questions}
                currentIndex={currentIndex}
                userAnswers={userAnswers}
                flags={flags}
                showExplanation={showExplanation}
                isTutored={isTutored}
                onQuestionClick={handleQuestionClick}
            />

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Scrollable Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', paddingBottom: '6rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                Question {currentIndex + 1} / {questions.length}
                            </span>
                            <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                ({answeredCount} answered)
                            </span>
                        </div>
                        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                            {formatTime(timeElapsed)}
                        </div>
                    </div>

                    {/* Question Card */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        {/* Flag Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                            <button
                                onClick={handleToggleFlag}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: isFlagged ? '2px solid #f59e0b' : '1px solid var(--border-color)',
                                    background: isFlagged ? '#fef3c7' : 'white',
                                    color: isFlagged ? '#f59e0b' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {isFlagged ? '🚩' : '⚑'} {isFlagged ? 'Flagged' : 'Flag'}
                            </button>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
                        </div>

                        {/* Options */}
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {currentQuestion.options.map((opt) => {
                                const isSelected = userAnswers[currentIndex] === opt.option;
                                const showCorrectness = isTutored && showingExplanation;
                                const isThisCorrect = opt.option === currentQuestion.correct_answer;

                                let borderColor = 'var(--border-color)';
                                let backgroundColor = 'white';

                                if (showCorrectness) {
                                    if (isThisCorrect) {
                                        borderColor = 'var(--success-color)';
                                        backgroundColor = '#f0fdf4';
                                    } else if (isSelected && !isThisCorrect) {
                                        borderColor = '#ef4444';
                                        backgroundColor = '#fef2f2';
                                    }
                                } else if (isSelected) {
                                    borderColor = 'var(--accent-color)';
                                    backgroundColor = '#f8fafc';
                                }

                                return (
                                    <div
                                        key={opt.option}
                                        onClick={() => handleAnswerSelect(opt.option)}
                                        style={{
                                            padding: '1rem',
                                            border: `2px solid ${borderColor}`,
                                            borderRadius: '8px',
                                            cursor: (isTutored && showingExplanation) ? 'not-allowed' : 'pointer',
                                            backgroundColor,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <span style={{ fontWeight: 600, minWidth: '24px' }}>{opt.option}.</span>
                                            <div dangerouslySetInnerHTML={{ __html: opt.text }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation (Tutored Mode) */}
                        {isTutored && showingExplanation && (
                            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: isCorrect ? 'var(--success-color)' : '#ef4444' }}>
                                        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                    </strong>
                                    <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>
                                        Correct Answer: {currentQuestion.correct_answer}
                                    </span>
                                </div>
                                <div className="explanation-content" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Bottom Navigation Bar */}
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: '250px',
                    right: 0,
                    background: 'white',
                    borderTop: '2px solid var(--border-color)',
                    padding: '1rem 2rem',
                    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Left: Previous/Next */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'white',
                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                    opacity: currentIndex === 0 ? 0.5 : 1,
                                    fontWeight: 600
                                }}
                            >
                                ← Previous
                            </button>

                            {isTutored && hasAnswered && !showingExplanation && (
                                <button
                                    onClick={handleSubmitAnswer}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'var(--success-color)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Submit Answer
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                {isLastQuestion ? 'Finish Test' : 'Next →'}
                            </button>
                        </div>

                        {/* Right: Suspend/Finalize */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleSuspendTest}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '2px solid var(--accent-color)',
                                    background: 'white',
                                    color: 'var(--accent-color)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                💾 Suspend Test
                            </button>
                            <button
                                onClick={handleFinishTest}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '2px solid var(--success-color)',
                                    background: 'white',
                                    color: 'var(--success-color)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                ✓ Finalize Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestInterface;

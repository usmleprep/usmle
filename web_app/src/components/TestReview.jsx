import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TestReview = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState({});

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
        const foundTest = history.find(t => t.id === testId);

        if (!foundTest) {
            navigate('/history');
            return;
        }

        setTest(foundTest);
        // Expand all questions by default
        const expanded = {};
        foundTest.questions.forEach((_, idx) => {
            expanded[idx] = true;
        });
        setExpandedQuestions(expanded);
    }, [testId, navigate]);

    if (!test) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const toggleQuestion = (idx) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                <h1>Test Review</h1>
            </header>

            {/* Summary Card */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {formatDate(test.date)}
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: test.score >= 70 ? 'var(--success-color)' : '#ef4444' }}>
                        {test.score}%
                    </div>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        {test.correctCount} / {test.totalQuestions} correct
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mode</div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{test.mode}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Timing</div>
                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{test.timing}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Duration</div>
                        <div style={{ fontWeight: 600 }}>{formatDuration(test.duration)}</div>
                    </div>
                </div>
            </div>

            {/* Questions Review */}
            <h2 style={{ marginBottom: '1rem' }}>Question-by-Question Review</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {test.questions.map((question, idx) => {
                    const isExpanded = expandedQuestions[idx];
                    const isCorrect = question.isCorrect;

                    return (
                        <div key={idx} className="card">
                            <div
                                onClick={() => toggleQuestion(idx)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    marginBottom: isExpanded ? '1rem' : 0
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        color: isCorrect ? 'var(--success-color)' : '#ef4444'
                                    }}>
                                        {isCorrect ? '✓' : '✗'}
                                    </span>
                                    <span style={{ fontWeight: 600 }}>Question {idx + 1}</span>
                                </div>
                                <span>{isExpanded ? '▲' : '▼'}</span>
                            </div>

                            {isExpanded && (
                                <>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div dangerouslySetInnerHTML={{ __html: question.question }} />
                                    </div>

                                    <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        {question.options.map((opt) => {
                                            const isUserAnswer = opt.option === question.userAnswer;
                                            const isCorrectAnswer = opt.option === question.correct_answer;

                                            let borderColor = 'var(--border-color)';
                                            let backgroundColor = 'white';

                                            if (isCorrectAnswer) {
                                                borderColor = 'var(--success-color)';
                                                backgroundColor = '#f0fdf4';
                                            } else if (isUserAnswer && !isCorrectAnswer) {
                                                borderColor = '#ef4444';
                                                backgroundColor = '#fef2f2';
                                            }

                                            return (
                                                <div
                                                    key={opt.option}
                                                    style={{
                                                        padding: '0.75rem',
                                                        border: `2px solid ${borderColor}`,
                                                        borderRadius: '6px',
                                                        backgroundColor
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

                                    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Your Answer:</strong> {question.userAnswer || 'Not answered'}
                                            {' | '}
                                            <strong>Correct Answer:</strong> {question.correct_answer}
                                        </div>
                                        <div style={{ marginTop: '1rem' }}>
                                            <strong>Explanation:</strong>
                                            <div className="explanation-content" style={{ marginTop: '0.5rem' }} dangerouslySetInnerHTML={{ __html: question.explanation }} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/create-test')}
                    style={{
                        padding: '0.75rem 2rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--accent-color)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    Create New Test
                </button>
            </div>
        </div>
    );
};

export default TestReview;

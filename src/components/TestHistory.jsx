import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TestHistory = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
        setTests(history.reverse()); // Most recent first
    }, []);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleResumeTest = (e, test) => {
        e.stopPropagation(); // Prevent card click

        navigate('/test', {
            state: {
                questions: test.questions,
                config: test.config || { mode: test.mode, timing: test.timing },
                resumeData: {
                    testId: test.id,
                    currentIndex: test.currentIndex || 0,
                    userAnswers: test.userAnswers || {},
                    showExplanation: test.showExplanation || {},
                    flags: test.flags || {},
                    timeElapsed: test.duration || 0,
                    testStartTime: Date.now() - (test.duration * 1000 || 0)
                }
            }
        });
    };

    const handleViewTest = (test) => {
        if (test.status === 'suspended') {
            // For suspended tests, resume instead of review
            handleResumeTest({ stopPropagation: () => { } }, test);
        } else {
            navigate(`/review/${test.id}`);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                <h1>Test History</h1>
            </header>

            {tests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No tests completed yet.</p>
                    <button
                        onClick={() => navigate('/create-test')}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--accent-color)',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Create Your First Test
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {tests.map((test) => {
                        const isSuspended = test.status === 'suspended';
                        const answeredCount = test.answeredCount || test.totalQuestions;

                        return (
                            <div
                                key={test.id}
                                onClick={() => handleViewTest(test)}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    border: isSuspended ? '2px solid #f59e0b' : undefined
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                {formatDate(test.date)}
                                            </div>
                                            {isSuspended && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#fef3c7',
                                                    color: '#f59e0b',
                                                    fontWeight: 600
                                                }}>
                                                    SUSPENDED
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            {!isSuspended ? (
                                                <>
                                                    <span style={{ fontSize: '2rem', fontWeight: 700, color: test.score >= 70 ? 'var(--success-color)' : '#ef4444' }}>
                                                        {test.score}%
                                                    </span>
                                                    <div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                            {test.correctCount} / {answeredCount} correct
                                                        </div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                            {test.mode} • {test.timing} • {formatDuration(test.duration)}
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                        {answeredCount} / {test.totalQuestions} answered
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                        {test.mode} • {test.timing} • {formatDuration(test.duration)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {isSuspended && (
                                            <button
                                                onClick={(e) => handleResumeTest(e, test)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: '#f59e0b',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                Resume
                                            </button>
                                        )}
                                        <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>→</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TestHistory;

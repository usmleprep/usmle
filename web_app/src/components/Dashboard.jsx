import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CircularChart from './CircularChart';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalQuestions: 0,
        questionsDone: 0,
        correctPercentage: 0
    });
    const [loading, setLoading] = useState(true);

    const loadStats = () => {
        fetch('./data/usmle_questions.json')
            .then(res => res.json())
            .then(data => {
                // Get test history from localStorage
                const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');

                // Calculate real statistics
                let totalQuestionsAnswered = 0;
                let totalCorrectAnswers = 0;

                testHistory.forEach(test => {
                    totalQuestionsAnswered += test.totalQuestions;
                    totalCorrectAnswers += test.correctCount;
                });

                const correctPercentage = totalQuestionsAnswered > 0
                    ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100)
                    : 0;

                setStats({
                    totalQuestions: data.length,
                    questionsDone: totalQuestionsAnswered,
                    correctPercentage: correctPercentage
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load questions:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadStats();
    }, []);

    const handleResetProgress = () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: This will permanently delete ALL your progress!\n\n' +
            'This includes:\n' +
            '• All test history\n' +
            '• All question performance data\n' +
            '• All flagged questions\n\n' +
            'This action CANNOT be undone.\n\n' +
            'Are you sure you want to continue?'
        );

        if (confirmed) {
            const doubleConfirm = window.confirm(
                'Are you ABSOLUTELY sure?\n\n' +
                'This is your last chance to cancel before all data is deleted.'
            );

            if (doubleConfirm) {
                // Clear all localStorage data
                localStorage.removeItem('testHistory');
                localStorage.removeItem('questionPerformance');

                // Reload stats
                loadStats();

                alert('✓ All progress has been reset successfully.');
            }
        }
    };

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    const donePercentage = stats.totalQuestions > 0
        ? Math.round((stats.questionsDone / stats.totalQuestions) * 100)
        : 0;

    const userEmail = localStorage.getItem('usmle_user_email') || '';

    const handleLogout = () => {
        const confirmed = window.confirm('Are you sure you want to logout?');
        if (confirmed) {
            localStorage.removeItem('usmle_authenticated');
            localStorage.removeItem('usmle_user_email');
            localStorage.removeItem('usmle_session_time');
            window.location.reload();
        }
    };

    return (
        <div className="dashboard">
            <header style={{ marginBottom: '3rem', textAlign: 'center', position: 'relative' }}>
                {/* Logout button - top right */}
                <div style={{ position: 'absolute', top: 0, right: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {userEmail}
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#ef4444';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        🚪 Logout
                    </button>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>USMLE Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your progress and mastery.</p>
            </header>

            <div className="card flex-center" style={{ gap: '4rem', flexWrap: 'wrap', padding: '4rem', marginBottom: '3rem' }}>
                <CircularChart
                    percentage={donePercentage}
                    color="var(--accent-color)"
                    label={`Questions Done (${stats.questionsDone}/${stats.totalQuestions})`}
                />
                <CircularChart
                    percentage={stats.correctPercentage}
                    color="var(--success-color)"
                    label="Correct Percentage"
                />
            </div>

            <div className="flex-center" style={{ gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/history')}
                    style={{
                        background: 'white',
                        color: 'var(--text-primary)',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        border: '2px solid var(--border-color)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    📊 View History
                </button>
                <button
                    onClick={() => navigate('/create-test')}
                    style={{
                        background: 'var(--text-primary)',
                        color: 'white',
                        padding: '1rem 2rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    + Create New Test
                </button>
            </div>

            <div className="flex-center" style={{ marginTop: '1rem' }}>
                <button
                    onClick={handleResetProgress}
                    style={{
                        background: 'white',
                        color: '#dc2626',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: '2px solid #fecaca',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#fecaca';
                        e.currentTarget.style.backgroundColor = 'white';
                    }}
                >
                    🗑️ Reset All Progress
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

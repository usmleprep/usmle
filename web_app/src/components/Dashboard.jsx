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

    useEffect(() => {
        fetch('/data/usmle_questions.json')
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
    }, []);

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    const donePercentage = stats.totalQuestions > 0
        ? Math.round((stats.questionsDone / stats.totalQuestions) * 100)
        : 0;

    return (
        <div className="dashboard">
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
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

            <div className="flex-center" style={{ gap: '1rem' }}>
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
        </div>
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [availableTopics, setAvailableTopics] = useState({});

    // Configuration State
    const [mode, setMode] = useState('tutored');
    const [timing, setTiming] = useState('untimed');
    const [questionCount, setQuestionCount] = useState(10);
    const [questionFilters, setQuestionFilters] = useState({
        all: true,
        unused: false,
        incorrect: false,
        flagged: false
    });
    const [selectedTopics, setSelectedTopics] = useState({});
    const [expandedSystems, setExpandedSystems] = useState({});

    useEffect(() => {
        fetch('/data/usmle_questions.json')
            .then(res => res.json())
            .then(data => {
                setQuestions(data);

                const topicsMap = {};
                data.forEach(q => {
                    const sys = q.system || 'Uncategorized';
                    const top = q.topic || 'General';

                    if (!topicsMap[sys]) {
                        topicsMap[sys] = new Set();
                    }
                    topicsMap[sys].add(top);
                });

                const processedTopics = {};
                Object.keys(topicsMap).sort().forEach(sys => {
                    processedTopics[sys] = Array.from(topicsMap[sys]).sort();
                });

                setAvailableTopics(processedTopics);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load data:", err);
                setLoading(false);
            });
    }, []);

    const handleSystemToggle = (system) => {
        setExpandedSystems(prev => ({
            ...prev,
            [system]: !prev[system]
        }));
    };

    const handleTopicSelect = (system, topic) => {
        setSelectedTopics(prev => {
            const sysTopics = prev[system] || {};
            const newSysTopics = { ...sysTopics, [topic]: !sysTopics[topic] };

            if (!newSysTopics[topic]) {
                delete newSysTopics[topic];
            }

            if (Object.keys(newSysTopics).length === 0) {
                const newSelected = { ...prev };
                delete newSelected[system];
                return newSelected;
            }

            return { ...prev, [system]: newSysTopics };
        });
    };

    const handleSelectAllSystem = (system) => {
        const allTopics = availableTopics[system];
        const currentSelected = selectedTopics[system] || {};
        const allSelected = allTopics.every(t => currentSelected[t]);

        if (allSelected) {
            const newSelected = { ...selectedTopics };
            delete newSelected[system];
            setSelectedTopics(newSelected);
        } else {
            const newSysTopics = {};
            allTopics.forEach(t => newSysTopics[t] = true);
            setSelectedTopics(prev => ({ ...prev, [system]: newSysTopics }));
        }
    };

    const handleStartTest = () => {
        const activeTopics = [];
        Object.entries(selectedTopics).forEach(([system, topics]) => {
            Object.keys(topics).forEach(topic => {
                if (topics[topic]) {
                    activeTopics.push({ system, topic });
                }
            });
        });

        if (activeTopics.length === 0) {
            alert("Please select at least one topic.");
            return;
        }

        // Filter by topics
        let filteredQuestions = questions.filter(q => {
            const sys = q.system || 'Uncategorized';
            const top = q.topic || 'General';
            return selectedTopics[sys] && selectedTopics[sys][top];
        });

        // Apply question filters (unused/incorrect/flagged)
        if (!questionFilters.all) {
            const performance = JSON.parse(localStorage.getItem('questionPerformance') || '{}');

            filteredQuestions = filteredQuestions.filter(q => {
                let matches = false;

                if (questionFilters.unused) {
                    const isUnused = !performance[q.id] || performance[q.id].timesAnswered === 0;
                    if (isUnused) matches = true;
                }

                if (questionFilters.incorrect) {
                    const perf = performance[q.id];
                    const isIncorrect = perf && perf.timesAnswered > 0 &&
                        perf.timesCorrect < (perf.timesAnswered - perf.timesCorrect);
                    if (isIncorrect) matches = true;
                }

                if (questionFilters.flagged) {
                    const isFlagged = performance[q.id]?.flagged;
                    if (isFlagged) matches = true;
                }

                return matches;
            });
        }

        if (filteredQuestions.length === 0) {
            alert("No questions found for the selected criteria.");
            return;
        }

        const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, questionCount);

        navigate('/test', {
            state: {
                questions: selectedQuestions,
                config: { mode, timing, questionCount }
            }
        });
    };

    const toggleStyle = (isActive) => ({
        flex: 1,
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        border: isActive ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
        background: isActive ? 'var(--accent-color)' : 'white',
        color: isActive ? 'white' : 'var(--text-primary)',
        cursor: 'pointer',
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.2s'
    });

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    return (
        <div className="create-test-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                <h1>Create New Test</h1>
            </header>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Test Settings</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                    {/* Mode Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Test Mode</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setMode('tutored')}
                                style={toggleStyle(mode === 'tutored')}
                            >
                                Tutored
                            </button>
                            <button
                                onClick={() => setMode('untutored')}
                                style={toggleStyle(mode === 'untutored')}
                            >
                                Untutored
                            </button>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            {mode === 'tutored' ? 'Answers shown immediately.' : 'Answers shown at the end.'}
                        </p>
                    </div>

                    {/* Timing Selection */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Timing</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setTiming('timed')}
                                style={toggleStyle(timing === 'timed')}
                            >
                                Timed
                            </button>
                            <button
                                onClick={() => setTiming('untimed')}
                                style={toggleStyle(timing === 'untimed')}
                            >
                                Untimed
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Count */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Number of Questions (Max 40)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="40"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Math.min(40, Math.max(1, parseInt(e.target.value) || 0)))}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            width: '100px',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {/* Question Filters - Toggle Buttons */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600 }}>
                        Question Filters
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setQuestionFilters({ all: true, unused: false, incorrect: false, flagged: false })}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: questionFilters.all ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                background: questionFilters.all ? 'var(--accent-color)' : 'white',
                                color: questionFilters.all ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: questionFilters.all ? 600 : 400,
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setQuestionFilters(prev => ({
                                all: false,
                                unused: !prev.unused,
                                incorrect: prev.incorrect,
                                flagged: prev.flagged
                            }))}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: questionFilters.unused ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                background: questionFilters.unused ? 'var(--accent-color)' : 'white',
                                color: questionFilters.unused ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: questionFilters.unused ? 600 : 400,
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            Unused
                        </button>
                        <button
                            onClick={() => setQuestionFilters(prev => ({
                                all: false,
                                unused: prev.unused,
                                incorrect: !prev.incorrect,
                                flagged: prev.flagged
                            }))}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: questionFilters.incorrect ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                background: questionFilters.incorrect ? 'var(--accent-color)' : 'white',
                                color: questionFilters.incorrect ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: questionFilters.incorrect ? 600 : 400,
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            Incorrect
                        </button>
                        <button
                            onClick={() => setQuestionFilters(prev => ({
                                all: false,
                                unused: prev.unused,
                                incorrect: prev.incorrect,
                                flagged: !prev.flagged
                            }))}
                            style={{
                                flex: 1,
                                minWidth: '100px',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: questionFilters.flagged ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                                background: questionFilters.flagged ? 'var(--accent-color)' : 'white',
                                color: questionFilters.flagged ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontWeight: questionFilters.flagged ? 600 : 400,
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            Flagged
                        </button>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ marginBottom: '1.5rem' }}>Select Topics</h2>
                <div className="topics-list">
                    {Object.entries(availableTopics).map(([system, topics]) => {
                        const isExpanded = expandedSystems[system];
                        const selectedCount = Object.keys(selectedTopics[system] || {}).length;
                        const isAllSelected = selectedCount === topics.length && topics.length > 0;
                        const isIndeterminate = selectedCount > 0 && !isAllSelected;

                        return (
                            <div key={system} style={{ borderBottom: '1px solid var(--border-color)', padding: '1rem 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                            onChange={() => handleSelectAllSystem(system)}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        <span
                                            onClick={() => handleSystemToggle(system)}
                                            style={{ cursor: 'pointer', fontWeight: 500, fontSize: '1.1rem' }}
                                        >
                                            {system}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleSystemToggle(system)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {isExpanded ? '▲' : '▼'}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div style={{ paddingLeft: '2.5rem', marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
                                        {topics.map(topic => (
                                            <label key={topic} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!(selectedTopics[system] && selectedTopics[system][topic])}
                                                    onChange={() => handleTopicSelect(system, topic)}
                                                />
                                                <span style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center', paddingBottom: '4rem' }}>
                <button
                    onClick={handleStartTest}
                    style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        padding: '1rem 3rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    Start Test
                </button>
            </div>
        </div>
    );
};

export default CreateTest;

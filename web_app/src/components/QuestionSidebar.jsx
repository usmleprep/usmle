import React from 'react';

const QuestionSidebar = ({
    questions,
    currentIndex,
    userAnswers,
    flags,
    showExplanation,
    isTutored,
    onQuestionClick
}) => {
    const getQuestionStatus = (index) => {
        const question = questions[index];
        const hasAnswer = userAnswers[index] !== undefined;
        const isFlagged = flags[index];
        const isCorrect = userAnswers[index] === question.correct_answer;
        const hasExplanation = showExplanation[index];

        // Flagged takes priority in color
        if (isFlagged) return 'flagged';

        // In tutored mode with explanation shown
        if (isTutored && hasExplanation) {
            return isCorrect ? 'correct' : 'incorrect';
        }

        // Has answer but no explanation yet
        if (hasAnswer) return 'answered';

        // Not answered
        return 'unanswered';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'correct': return '#10b981'; // green
            case 'incorrect': return '#ef4444'; // red
            case 'answered': return '#3b82f6'; // blue
            case 'flagged': return '#f59e0b'; // yellow/orange
            case 'unanswered': return '#e5e7eb'; // gray
            default: return '#e5e7eb';
        }
    };

    return (
        <div style={{
            width: '5vw',
            minWidth: '50px',
            maxWidth: '70px',
            height: '100%',
            borderRight: '1px solid var(--border-color)',
            padding: '0.5rem 0.25rem',
            overflowY: 'auto',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Question Grid - Single Column */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                width: '100%',
                alignItems: 'center'
            }}>
                {questions.map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isCurrent = index === currentIndex;

                    return (
                        <button
                            key={index}
                            onClick={() => onQuestionClick(index)}
                            style={{
                                width: '100%',
                                maxWidth: '45px',
                                height: '32px',
                                borderRadius: '4px',
                                border: isCurrent ? '2px solid var(--accent-color)' : '1px solid #d1d5db',
                                backgroundColor: getStatusColor(status),
                                color: status === 'unanswered' ? 'var(--text-primary)' : 'white',
                                fontSize: '0.7rem',
                                fontWeight: isCurrent ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionSidebar;

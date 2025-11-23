// Question Performance Tracking Utility

const STORAGE_KEY = 'questionPerformance';

/**
 * Get question performance data from localStorage
 */
export const getQuestionPerformance = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

/**
 * Update question performance after answering
 */
export const updateQuestionPerformance = (questionId, isCorrect) => {
    const performance = getQuestionPerformance();

    if (!performance[questionId]) {
        performance[questionId] = {
            timesAnswered: 0,
            timesCorrect: 0,
            lastAnswered: null,
            flagged: false
        };
    }

    performance[questionId].timesAnswered += 1;
    if (isCorrect) {
        performance[questionId].timesCorrect += 1;
    }
    performance[questionId].lastAnswered = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(performance));
};

/**
 * Toggle flag status for a question
 */
export const toggleQuestionFlag = (questionId) => {
    const performance = getQuestionPerformance();

    if (!performance[questionId]) {
        performance[questionId] = {
            timesAnswered: 0,
            timesCorrect: 0,
            lastAnswered: null,
            flagged: false
        };
    }

    performance[questionId].flagged = !performance[questionId].flagged;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(performance));
    return performance[questionId].flagged;
};

/**
 * Check if a question is flagged
 */
export const isQuestionFlagged = (questionId) => {
    const performance = getQuestionPerformance();
    return performance[questionId]?.flagged || false;
};

/**
 * Filter questions based on criteria
 */
export const filterQuestions = (questions, filterType) => {
    const performance = getQuestionPerformance();

    switch (filterType) {
        case 'unused':
            // Questions never answered
            return questions.filter(q => !performance[q.id] || performance[q.id].timesAnswered === 0);

        case 'incorrect':
            // Questions answered incorrectly (more incorrect than correct)
            return questions.filter(q => {
                const perf = performance[q.id];
                if (!perf || perf.timesAnswered === 0) return false;
                return perf.timesCorrect < (perf.timesAnswered - perf.timesCorrect);
            });

        case 'flagged':
            // Flagged questions
            return questions.filter(q => performance[q.id]?.flagged);

        case 'all':
        default:
            return questions;
    }
};

/**
 * Get statistics for a question
 */
export const getQuestionStats = (questionId) => {
    const performance = getQuestionPerformance();
    return performance[questionId] || {
        timesAnswered: 0,
        timesCorrect: 0,
        lastAnswered: null,
        flagged: false
    };
};

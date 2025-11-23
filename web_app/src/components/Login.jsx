import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simple password check
        if (password === 'usmle2025') {
            // Save session to localStorage
            localStorage.setItem('usmle_authenticated', 'true');
            localStorage.setItem('usmle_session_time', new Date().getTime().toString());

            // Notify parent component
            if (onLoginSuccess) {
                onLoginSuccess('user');
            }
        } else {
            setError('Incorrect password. Please try again.');
        }

        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '3rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        marginBottom: '0.5rem',
                        color: '#1a202c',
                        fontWeight: 700
                    }}>
                        USMLE Question Bank
                    </h1>
                    <p style={{ color: '#718096', fontSize: '1rem' }}>
                        Enter password to continue
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 600,
                            color: '#2d3748',
                            fontSize: '0.95rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            disabled={loading}
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                if (!error) e.target.style.borderColor = '#667eea';
                            }}
                            onBlur={(e) => {
                                if (!error) e.target.style.borderColor = '#e2e8f0';
                            }}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '0.875rem',
                            borderRadius: '8px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem',
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !password}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: loading || !password ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            cursor: loading || !password ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: loading || !password ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseOver={(e) => {
                            if (!loading && password) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = loading || !password ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        {loading ? 'Verifying...' : 'Access App'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#a0aec0'
                }}>
                    <p>Don't have access? Contact your administrator</p>
                </div>
            </div>
        </div>
    );
};

export default Login;

import React, { useState } from 'react';
import { isEmailAuthorized } from '../config/authorizedEmails';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        // Check if email is authorized
        if (isEmailAuthorized(email)) {
            // Save session to localStorage
            localStorage.setItem('usmle_authenticated', 'true');
            localStorage.setItem('usmle_user_email', email.toLowerCase().trim());
            localStorage.setItem('usmle_session_time', new Date().getTime().toString());

            // Notify parent component
            if (onLoginSuccess) {
                onLoginSuccess(email);
            }
        } else {
            setError('Access denied. Your email is not authorized to access this system.');
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
                        Enter your authorized email to continue
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
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
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
                        disabled={loading || !email}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: loading || !email ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            cursor: loading || !email ? 'not-allowed' : 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: loading || !email ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseOver={(e) => {
                            if (!loading && email) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = loading || !email ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)';
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

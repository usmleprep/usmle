import React, { useState, useEffect } from 'react';

const LicenseActivation = ({ onActivated }) => {
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [machineId, setMachineId] = useState('');

    useEffect(() => {
        // Get machine ID when component mounts
        if (window.electronAPI) {
            window.electronAPI.getMachineId().then(result => {
                if (result.id) {
                    setMachineId(result.id);
                }
            });
        }
    }, []);

    const handleActivate = async () => {
        setError('');
        setLoading(true);

        try {
            if (!window.electronAPI) {
                setError('Electron API not available');
                setLoading(false);
                return;
            }

            const result = await window.electronAPI.activateLicense(licenseKey);

            if (result.success) {
                // License activated successfully
                if (onActivated) {
                    onActivated();
                }
            } else {
                setError(result.message || 'Activation failed');
            }
        } catch (err) {
            setError('An error occurred during activation');
            console.error('Activation error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleActivate();
        }
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
                borderRadius: '12px',
                padding: '3rem',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1a202c' }}>
                        USMLE Question Bank
                    </h1>
                    <p style={{ color: '#718096', fontSize: '0.95rem' }}>
                        Activate your license to get started
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 600,
                        color: '#2d3748',
                        fontSize: '0.9rem'
                    }}>
                        License Key
                    </label>
                    <input
                        type="text"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="USMLE-XXXX-XXXX-XXXX-XXXX"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: error ? '2px solid #ef4444' : '2px solid #e2e8f0',
                            fontSize: '1rem',
                            fontFamily: 'monospace',
                            letterSpacing: '0.05em',
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

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '6px',
                        background: '#fee2e2',
                        color: '#991b1b',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        border: '1px solid #fecaca'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleActivate}
                    disabled={loading || !licenseKey}
                    style={{
                        width: '100%',
                        padding: '0.875rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: loading || !licenseKey ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: loading || !licenseKey ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: loading || !licenseKey ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseOver={(e) => {
                        if (!loading && licenseKey) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                        }
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = loading || !licenseKey ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                >
                    {loading ? 'Activating...' : 'Activate License'}
                </button>

                {machineId && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: '#f7fafc',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <p style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Machine ID (for support):
                        </p>
                        <code style={{
                            fontSize: '0.7rem',
                            color: '#2d3748',
                            wordBreak: 'break-all',
                            fontFamily: 'monospace'
                        }}>
                            {machineId}
                        </code>
                    </div>
                )}

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: '#a0aec0'
                }}>
                    <p>Need help? Contact support@example.com</p>
                </div>
            </div>
        </div>
    );
};

export default LicenseActivation;

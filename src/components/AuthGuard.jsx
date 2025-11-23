import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkEmailAuthorized } from '../utils/supabaseClient';

const AuthGuard = ({ children, setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const validateSession = async () => {
        const storedEmail = localStorage.getItem('usmle_user_email');

        if (!storedEmail) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const result = await checkEmailAuthorized(storedEmail);

            if (!result.authorized) {
                console.log('Session expired or revoked:', result.error);
                localStorage.removeItem('usmle_authenticated');
                localStorage.removeItem('usmle_user_email');
                localStorage.removeItem('usmle_session_time');
                setIsAuthenticated(false);
                alert('Your session has expired. Please log in again.');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Don't logout on connection error, just log it
        }
    };

    // Check on route change
    useEffect(() => {
        validateSession();
    }, [location.pathname]);

    // Check periodically (every 5 minutes)
    useEffect(() => {
        const interval = setInterval(validateSession, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return children;
};

export default AuthGuard;

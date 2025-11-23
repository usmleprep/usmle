import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Check if an email is authorized to access the app
 * @param {string} email - Email to check
 * @returns {Promise<{authorized: boolean, error?: string}>}
 */
export async function checkEmailAuthorized(email) {
    try {
        const { data, error } = await supabase
            .from('authorized_users')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned - email not authorized
                return { authorized: false, error: 'Email not authorized' };
            }
            console.error('Supabase error:', error);
            return { authorized: false, error: 'Database error' };
        }

        // Check if license has expired
        if (data.expires_at) {
            const expirationDate = new Date(data.expires_at);
            if (expirationDate < new Date()) {
                return { authorized: false, error: 'License has expired' };
            }
        }

        return { authorized: true };
    } catch (error) {
        console.error('Authorization check failed:', error);
        return { authorized: false, error: 'Connection error' };
    }
}

/**
 * Add a new authorized email (admin function)
 * @param {string} email - Email to authorize
 * @param {Date} expiresAt - Optional expiration date
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function addAuthorizedEmail(email, expiresAt = null) {
    try {
        const { error } = await supabase
            .from('authorized_users')
            .insert([
                {
                    email: email.toLowerCase(),
                    expires_at: expiresAt,
                    active: true
                }
            ]);

        if (error) {
            console.error('Failed to add email:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to add email:', error);
        return { success: false, error: 'Connection error' };
    }
}

/**
 * Remove an authorized email (admin function)
 * @param {string} email - Email to remove
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function removeAuthorizedEmail(email) {
    try {
        const { error } = await supabase
            .from('authorized_users')
            .update({ active: false })
            .eq('email', email.toLowerCase());

        if (error) {
            console.error('Failed to remove email:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to remove email:', error);
        return { success: false, error: 'Connection error' };
    }
}

/**
 * Get all authorized emails (admin function)
 * @returns {Promise<{emails: Array, error?: string}>}
 */
export async function getAllAuthorizedEmails() {
    try {
        const { data, error } = await supabase
            .from('authorized_users')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch emails:', error);
            return { emails: [], error: error.message };
        }

        return { emails: data };
    } catch (error) {
        console.error('Failed to fetch emails:', error);
        return { emails: [], error: 'Connection error' };
    }
}

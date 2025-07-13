import React from 'react';
import { useIsAuthenticated, useMsal, useAccount } from '@azure/msal-react';

const AuthenticatedTemplate = ({ children }) => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    if (!isAuthenticated) {
        return (
            <div className="auth-required">
                <h2>Authentication Required</h2>
                <p>Please sign in to access the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="authenticated-content">
            {children}
        </div>
    );
};

export default AuthenticatedTemplate;
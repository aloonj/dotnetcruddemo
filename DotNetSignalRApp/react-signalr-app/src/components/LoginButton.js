import React from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

const LoginButton = () => {
    const { instance } = useMsal();

    const handleLogin = async () => {
        try {
            await instance.loginPopup(loginRequest);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <button onClick={handleLogin} className="login-button">
            Sign In with Microsoft
        </button>
    );
};

export default LoginButton;
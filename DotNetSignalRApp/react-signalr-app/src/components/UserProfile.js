import React, { useState, useEffect } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';
import { tokenRequest } from '../authConfig';

const UserProfile = () => {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [userInfo, setUserInfo] = useState(null);
    const [permissions, setPermissions] = useState(null);

    useEffect(() => {
        fetchUserInfo();
        fetchPermissions();
    }, [account]);

    const fetchUserInfo = async () => {
        try {
            const response = await instance.acquireTokenSilent({
                ...tokenRequest,
                account: account
            });

            const userResponse = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${response.accessToken}`
                }
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setUserInfo(userData);
            }
        } catch (error) {
            console.error('Failed to fetch user info:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await instance.acquireTokenSilent({
                ...tokenRequest,
                account: account
            });

            const permResponse = await fetch('/api/user/permissions', {
                headers: {
                    'Authorization': `Bearer ${response.accessToken}`
                }
            });

            if (permResponse.ok) {
                const permData = await permResponse.json();
                setPermissions(permData);
            }
        } catch (error) {
            console.error('Failed to fetch permissions:', error);
        }
    };

    const handleLogout = () => {
        instance.logoutPopup();
    };

    if (!account) {
        return null;
    }

    return (
        <div className="user-profile">
            <div className="user-info">
                <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(account.name || 'User')}&background=0078d4&color=fff`}
                    alt="User Avatar"
                    className="user-avatar"
                />
                <div className="user-details">
                    <div className="user-name">{userInfo?.name || account.name}</div>
                    <div className="user-email">{userInfo?.email || account.username}</div>
                    {userInfo?.organization && (
                        <div className="user-org">{userInfo.organization}</div>
                    )}
                    {userInfo?.isExternal && (
                        <span className="external-badge">External User</span>
                    )}
                </div>
            </div>
            
            {permissions && (
                <div className="user-permissions">
                    <div className="roles">
                        {permissions.roles.map(role => (
                            <span key={role} className={`role-badge role-${role.toLowerCase()}`}>
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            <button onClick={handleLogout} className="logout-button">
                Sign Out
            </button>
        </div>
    );
};

export default UserProfile;
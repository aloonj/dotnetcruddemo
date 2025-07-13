import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_AZURE_CLIENT_ID || 'your-spa-client-id',
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID || 'your-tenant-id'}`,
        redirectUri: process.env.REACT_APP_REDIRECT_URI || window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: [
        `api://${process.env.REACT_APP_API_CLIENT_ID || 'your-api-client-id'}/access_as_user`
    ],
    prompt: 'select_account'
};

export const tokenRequest = {
    scopes: [
        `api://${process.env.REACT_APP_API_CLIENT_ID || 'your-api-client-id'}/access_as_user`
    ],
    forceRefresh: false
};

export const graphConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
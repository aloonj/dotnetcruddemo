import React, { useState, useEffect } from 'react';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useAccount } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import './App.css';
import { itemsApi, setAuthToken } from './services/api';
import signalRService from './services/signalr';
import { msalConfig, tokenRequest } from './authConfig';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Dashboard from './components/Dashboard';
import LoginButton from './components/LoginButton';
import UserProfile from './components/UserProfile';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Main App component with authentication
function AuthenticatedApp() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [userPermissions, setUserPermissions] = useState(null);

  useEffect(() => {
    if (account) {
      initializeWithAuth();
    }
  }, [account]);

  const initializeWithAuth = async () => {
    try {
      // Get access token
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account: account
      });

      // Set token for API calls
      setAuthToken(response.accessToken);

      // Fetch user permissions
      await fetchUserPermissions();

      // Initialize SignalR connection with token
      await signalRService.startConnection(response.accessToken);
      
      // Set up SignalR event handlers
      signalRService.onConnected((connectionData) => {
        console.log('Connected:', connectionData);
        setConnected(true);
      });

      signalRService.onItemUpdate((updatedItem) => {
        setItems(prevItems => {
          const index = prevItems.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            const newItems = [...prevItems];
            newItems[index] = updatedItem;
            return newItems;
          } else {
            return [...prevItems, updatedItem];
          }
        });
      });

      signalRService.onItemDeleted((itemId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      });

      signalRService.onDashboardData((data) => {
        setDashboardData(data);
      });

      // Load initial data
      await loadItems();

    } catch (error) {
      console.error('Error initializing app:', error);
      if (error.name === 'InteractionRequiredAuthError') {
        // Require user interaction to get token
        instance.acquireTokenPopup(tokenRequest);
      }
    }
  };

  const fetchUserPermissions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5062/api'}/user/permissions`);
      if (response.ok) {
        const permissions = await response.json();
        setUserPermissions(permissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const loadItems = async () => {
    try {
      const response = await itemsApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleCreate = () => {
    if (userPermissions?.canEdit) {
      setEditingItem(null);
      setShowForm(true);
    } else {
      alert('You do not have permission to create items.');
    }
  };

  const handleEdit = (item) => {
    if (userPermissions?.canEdit) {
      setEditingItem(item);
      setShowForm(true);
    } else {
      alert('You do not have permission to edit items.');
    }
  };

  const handleDelete = async (id) => {
    if (!userPermissions?.canDelete) {
      alert('You do not have permission to delete items.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsApi.delete(id);
      } catch (error) {
        console.error('Error deleting item:', error);
        if (error.response?.status === 403) {
          alert('You do not have permission to delete this item.');
        }
      }
    }
  };

  const handleFormSubmit = async (item) => {
    try {
      if (item.id) {
        await itemsApi.update(item.id, item);
      } else {
        await itemsApi.create(item);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      if (error.response?.status === 403) {
        alert('You do not have permission to perform this action.');
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time CRUD Dashboard</h1>
        <div className="header-right">
          <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <UserProfile />
        </div>
      </header>
      
      <main>
        <Dashboard dashboardData={dashboardData} items={items} />
        
        <div className="items-section">
          <div className="items-header">
            <h2>Items Management</h2>
            {userPermissions?.canEdit && (
              <button onClick={handleCreate}>Add New Item</button>
            )}
          </div>
          
          {userPermissions && (
            <div className="permissions-info">
              <span className="permission-badge">
                Role: {userPermissions.roles.join(', ')}
              </span>
              {!userPermissions.canEdit && (
                <span className="permission-note">View-only access</span>
              )}
            </div>
          )}
          
          {showForm && (
            <div className="form-container">
              <h3>{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
              <ItemForm
                item={editingItem}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}
          
          <ItemList
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={userPermissions?.canEdit}
            canDelete={userPermissions?.canDelete}
          />
        </div>
      </main>
    </div>
  );
}

// Unauthenticated component
function UnauthenticatedApp() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time CRUD Dashboard</h1>
      </header>
      <main>
        <div className="login-container">
          <h2>Welcome to the SignalR Dashboard</h2>
          <p>This is a demonstration of real-time CRUD operations with Azure AD B2B authentication.</p>
          <div className="features">
            <h3>Features:</h3>
            <ul>
              <li>Real-time data updates with SignalR</li>
              <li>Role-based access control</li>
              <li>Multi-tenant Azure AD authentication</li>
              <li>Live charts and dashboard</li>
              <li>B2B partner collaboration</li>
            </ul>
          </div>
          <LoginButton />
        </div>
      </main>
    </div>
  );
}

// Root App component with MSAL Provider
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <AuthenticatedApp />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <UnauthenticatedApp />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}

export default App;
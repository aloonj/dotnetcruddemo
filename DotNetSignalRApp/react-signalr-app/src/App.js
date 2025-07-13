import React, { useState, useEffect } from 'react';
import './App.css';
import { itemsApi } from './services/api';
import signalRService from './services/signalr';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Dashboard from './components/Dashboard';

function App() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize SignalR connection
    signalRService.startConnection().then(() => {
      // Set up SignalR event handlers
      signalRService.onConnected((connectionId) => {
        console.log('Connected with ID:', connectionId);
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
    });

    // Load initial data
    loadItems();

    // Cleanup on unmount
    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemsApi.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsApi.delete(id);
      } catch (error) {
        console.error('Error deleting item:', error);
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
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </header>
      
      <main>
        <Dashboard dashboardData={dashboardData} items={items} />
        
        <div className="items-section">
          <div className="items-header">
            <h2>Items Management</h2>
            <button onClick={handleCreate}>Add New Item</button>
          </div>
          
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
          />
        </div>
      </main>
    </div>
  );
}

export default App;

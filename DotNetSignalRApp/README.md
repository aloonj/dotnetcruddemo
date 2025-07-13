# Real-Time CRUD Dashboard with SignalR

This application demonstrates a real-time dashboard with CRUD operations using .NET Web API with SignalR for the backend and React for the frontend.

## Features

- **Real-time updates**: All connected clients receive updates when data changes
- **CRUD operations**: Create, Read, Update, and Delete items
- **Live dashboard**: Shows total items, total value, low stock items, and recent items
- **Real-time charts**: Live inventory value line chart and color-coded stock levels bar chart
- **Automatic updates**: Dashboard and charts refresh every 2 seconds
- **Connection status**: Visual indicator showing SignalR connection status

## Technologies Used

- **Backend**: .NET 8 Web API, SignalR, Entity Framework Core (InMemory)
- **Frontend**: React, SignalR Client, Axios, Chart.js

## Project Structure

```
DotNetSignalRApp/
├── Controllers/          # API Controllers
├── Data/                # Entity Framework DbContext
├── Hubs/                # SignalR Hubs
├── Models/              # Data Models
├── Services/            # Background Services
├── Program.cs           # Application entry point
└── README.md

react-signalr-app/
├── src/
│   ├── components/      # React Components
│   ├── services/        # API and SignalR services
│   ├── App.js          # Main Application Component
│   └── App.css         # Styling
├── public/             # Static assets
└── package.json        # Node.js dependencies
```

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js and npm

### Running the Backend

1. Navigate to the project directory:
   ```bash
   cd DotNetSignalRApp
   ```

2. Run the .NET API:
   ```bash
   dotnet run
   ```

   The API will start on `http://localhost:5062` (or another port shown in the console)

3. Open the Swagger UI to test the API endpoints:
   ```
   http://localhost:5062/swagger
   ```

### Running the Frontend

1. In a new terminal, navigate to the React app:
   ```bash
   cd react-signalr-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the API URLs in the following files if your API is running on a different port:
   - `src/services/api.js` - Update `API_BASE_URL`
   - `src/services/signalr.js` - Update the SignalR hub URL

4. Start the React development server:
   ```bash
   npm start
   ```

   The React app will open at `http://localhost:3000`

## Usage

1. **View Dashboard**: The dashboard shows real-time statistics including:
   - Total number of items
   - Total inventory value
   - Number of low stock items (quantity < 10)
   - List of recent items

2. **Real-time Charts**: Watch live visualizations:
   - **Inventory Value Chart**: Line chart showing total inventory value over time
   - **Stock Levels Chart**: Color-coded bar chart (red = low stock, yellow = medium, green = good)

3. **Add New Item**: Click "Add New Item" to create a new inventory item

4. **Edit Item**: Click the "Edit" button next to any item to modify it

5. **Delete Item**: Click the "Delete" button to remove an item

6. **Real-time Updates**: All changes are immediately reflected across all connected clients and charts update instantly

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get a specific item
- `POST /api/items` - Create a new item
- `PUT /api/items/{id}` - Update an item
- `DELETE /api/items/{id}` - Delete an item

## SignalR Hub

The application uses SignalR for real-time communication:

- **Hub URL**: `/dashboardHub`
- **Events**:
  - `ReceiveItemUpdate` - Fired when an item is created or updated
  - `ReceiveItemDeleted` - Fired when an item is deleted
  - `ReceiveDashboardData` - Fired every 2 seconds with updated dashboard statistics

## Architecture

- **Backend Service**: `DashboardService` runs as a background service, sending dashboard updates every 2 seconds
- **SignalR Hub**: `DashboardHub` manages real-time connections and broadcasts updates
- **API Controller**: `ItemsController` handles CRUD operations and triggers SignalR notifications
- **React Components**: 
  - `App.js` - Main component managing state and SignalR connection
  - `Dashboard.js` - Displays real-time statistics
  - `ItemList.js` - Shows all items in a table
  - `ItemForm.js` - Handles item creation and editing
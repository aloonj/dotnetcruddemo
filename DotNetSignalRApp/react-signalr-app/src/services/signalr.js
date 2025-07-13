import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async startConnection(accessToken) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_SIGNALR_URL || 'http://localhost:5062'}/dashboardHub`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected with authentication');
      
      // Join user groups based on authentication
      await this.connection.invoke('JoinUserGroup');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      if (err.message.includes('401')) {
        console.warn('SignalR authentication failed - token may be expired');
      }
      setTimeout(() => this.startConnection(accessToken), 5000);
    }
  }

  onItemUpdate(callback) {
    if (this.connection) {
      this.connection.on('ReceiveItemUpdate', callback);
    }
  }

  onItemDeleted(callback) {
    if (this.connection) {
      this.connection.on('ReceiveItemDeleted', callback);
    }
  }

  onDashboardData(callback) {
    if (this.connection) {
      this.connection.on('ReceiveDashboardData', callback);
    }
  }

  onConnected(callback) {
    if (this.connection) {
      this.connection.on('Connected', callback);
    }
  }

  async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
    }
  }
}

export default new SignalRService();
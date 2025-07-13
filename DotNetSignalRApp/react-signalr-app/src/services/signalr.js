import * as signalR from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
  }

  async startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_SIGNALR_URL || 'http://localhost:5062'}/dashboardHub`)
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.startConnection(), 5000);
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
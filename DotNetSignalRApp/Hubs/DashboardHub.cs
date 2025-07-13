using Microsoft.AspNetCore.SignalR;
using DotNetSignalRApp.Models;

namespace DotNetSignalRApp.Hubs
{
    public class DashboardHub : Hub
    {
        public async Task SendItemUpdate(Item item)
        {
            await Clients.All.SendAsync("ReceiveItemUpdate", item);
        }

        public async Task SendItemDeleted(int itemId)
        {
            await Clients.All.SendAsync("ReceiveItemDeleted", itemId);
        }

        public async Task SendDashboardData(object dashboardData)
        {
            await Clients.All.SendAsync("ReceiveDashboardData", dashboardData);
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
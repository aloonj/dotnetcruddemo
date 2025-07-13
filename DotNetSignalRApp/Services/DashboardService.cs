using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using DotNetSignalRApp.Data;
using DotNetSignalRApp.Hubs;

namespace DotNetSignalRApp.Services
{
    public class DashboardService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IHubContext<DashboardHub> _hubContext;
        private readonly ILogger<DashboardService> _logger;

        public DashboardService(IServiceProvider serviceProvider, IHubContext<DashboardHub> hubContext, ILogger<DashboardService> logger)
        {
            _serviceProvider = serviceProvider;
            _hubContext = hubContext;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                        
                        var totalItems = await context.Items.CountAsync(stoppingToken);
                        var totalValue = await context.Items.SumAsync(x => x.Price * x.Quantity, stoppingToken);
                        var lowStockItems = await context.Items.CountAsync(x => x.Quantity < 10, stoppingToken);
                        var recentItems = await context.Items
                            .OrderByDescending(x => x.CreatedAt)
                            .Take(5)
                            .ToListAsync(stoppingToken);

                        var allItems = await context.Items.ToListAsync(stoppingToken);
                        
                        var dashboardData = new
                        {
                            totalItems,
                            totalValue,
                            lowStockItems,
                            recentItems,
                            allItems,
                            lastUpdated = DateTime.UtcNow
                        };

                        await _hubContext.Clients.All.SendAsync("ReceiveDashboardData", dashboardData, stoppingToken);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while sending dashboard data");
                }

                await Task.Delay(2000, stoppingToken); // Send updates every 2 seconds
            }
        }
    }
}
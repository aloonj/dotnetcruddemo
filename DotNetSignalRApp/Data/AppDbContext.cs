using Microsoft.EntityFrameworkCore;
using DotNetSignalRApp.Models;

namespace DotNetSignalRApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed some initial data
            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Laptop", Description = "High-performance laptop", Price = 999.99m, Quantity = 10, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Item { Id = 2, Name = "Mouse", Description = "Wireless mouse", Price = 29.99m, Quantity = 50, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new Item { Id = 3, Name = "Keyboard", Description = "Mechanical keyboard", Price = 89.99m, Quantity = 25, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            );
        }
    }
}
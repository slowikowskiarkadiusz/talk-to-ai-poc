using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<PlantEntry> PlantEntries => Set<PlantEntry>();
}

using Common.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Reposotories
{
    public class UserManagementDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public UserManagementDbContext()    
        {
            
        }

        public UserManagementDbContext(DbContextOptions<UserManagementDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .UseSqlServer("Server=(localdb)\\kris-local;Database=UserManagementDB;User Id=kris;Password=krispass;",
                    builder => builder.EnableRetryOnFailure())
                .UseLazyLoadingProxies(); 
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User()
            {
                Id = 1,
                Username = "kris",
                Password = "krispass",
                FirstName = "Kristian",
                LastName = "Dimov"
            });
        }
    }
}

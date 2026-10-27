using Microsoft.EntityFrameworkCore;
using MyFirstApi.Models; // 1. Importamos la carpeta donde guardaste a User y Product

namespace MyFirstApi.Data
{
    // 2. Nuestra clase hereda (:) de DbContext, que es la superclase de Entity Framework
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options) {

        // 4. LAS VENTANAS DE CONSULTA (DbSet)
        // DbSet le dice a .NET: "Crea una compuerta para hacer SELECT, INSERT, UPDATE o DELETE sobre estas tablas"

         public DbSet<User> Users { get; set; }
         public DbSet<Product> Products { get; set; }
    }
}

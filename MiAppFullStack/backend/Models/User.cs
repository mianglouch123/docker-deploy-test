using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace MyFirstApi.Models // Ajusta el namespace al nombre de tu proyecto
{
    [Table("USER")] // Le dice a .NET que en SQL la tabla se llama "USER" (en mayúsculas)
    public class User
    {  
        [Column("ID")]
        [Key] // Le dice a .NET que esta es la Clave Primaria (PK)
        public int Id { get; set; }
        [Column("NAME")]
        [Required]
        [StringLength(250)]
        public string Name { get; set; } = string.Empty;

        // Propiedad de Navegación: Un usuario puede tener MUCHOS productos
        // Esto equivale al pipeline de relación que analizamos en los JOINs
        public List<Product> Products { get; set; } = new List<Product>();
    }
}

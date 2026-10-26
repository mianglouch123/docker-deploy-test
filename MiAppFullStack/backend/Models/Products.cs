using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;


namespace MyFirstApi.Models { // Ajusta el namespace al nombre de tu proyecto


[Table("PRODUCT")] // Tabla real en mayúsculas
public class Product
{
    [Key]
    [Column("ID")] // <-- Le dice a EF: En SQL busca la columna "ID"
    public int Id { get; set; }

    [Required]
    [Column("CATEGORY")] // <-- En SQL se llama "CATEGORY"
    public string Category { get; set; } = string.Empty;

    [Column("PRICE", TypeName = "decimal(10,2)")] // <-- En SQL se llama "PRICE"
    public decimal Price { get; set; }

    [Required]
    [Column("CREATEDBYUSERID")] // <-- En SQL se llama "CREATEDBYUSERID"
    public int CreatedByUserId { get; set; }

    [ForeignKey("CreatedByUserId")]
    public User? User;

    
 }
}
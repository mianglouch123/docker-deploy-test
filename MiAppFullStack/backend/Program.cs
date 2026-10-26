using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore; 
using MyFirstApi.Data; 
using MyFirstApi.Middlewares;


var builder = WebApplication.CreateBuilder(args);

// A) Buscamos en el appsettings.json la cadena de conexión llamada "sqlstrings"

var connectionString = builder.Configuration.GetConnectionString("sqlstrings");
// B) "Inyectamos" tu DataContext en los servicios de la aplicación para que toda la API pueda usarlo



builder.Services.AddDbContext<DataContext>(options =>
{
 options.UseSqlServer(connectionString);	

});

builder.Services.AddControllers();   // 👈 ESTA LÍNEA FALTA


builder.Services.AddOpenApi();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();





var app = builder.Build();

using(var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<DataContext>();
  db.Database.Migrate();	

}


if (app.Environment.IsDevelopment())
{
 
   // Genera el plano JSON en la ruta /openapi/v1.json
    app.MapOpenApi(); 
    
    // ¡LA MAGIA!: Crea la interfaz web interactiva con botones en la ruta /scalar/v1
    app.MapScalarApiReference(); 
}

app.UseExceptionHandler();

app.MapControllers();


app.MapGet("/", () => "Hola mundo");

app.Run();

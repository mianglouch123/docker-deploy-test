using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using MyFirstApi.Data;
using MyFirstApi.Dtos;
using MyFirstApi.Models;

namespace MyFirstApi.Controllers
{
    [ApiController]
    // El token [controller] se reemplaza dinámicamente por 'user' -> api/user
    [Route("api/[controller]")] 

    
    public class UserController(DataContext context) : ControllerBase
    {
        // Se inicializa el campo explícitamente como privado y de solo lectura usando el parámetro superior
        private readonly DataContext _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            // Validaciones para asegurar que la paginación sea correcta
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;

            // Al usar 'await', el hilo actual se libera mientras la base de datos cuenta los registros
            var totalRecords = await _context.Users.CountAsync();

            // Paginación en base de datos usando Skip y Take (equivalente a Mongo skip y limit)
            var users = await _context.Users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Objeto anónimo para agrupar los metadatos de paginación
            var paginationMetadata = new
            {
                total = totalRecords,
                currentPage = page,
                pageSize = pageSize,
                totalPages = (int)Math.Ceiling((double)totalRecords / pageSize)
            };

            // Retorna un HTTP 200 con la estructura JSON anidada requerida
            return Ok(new 
            { 
                data = users, 
                pagination = paginationMetadata 
            });
        }
        [HttpGet("filter")]
        public async Task<IActionResult>GetUsersByName([FromQuery] string name , [FromQuery] int page , [FromQuery] int pageSize)
		{
         if (page <= 0) page = 1;
         if (pageSize <= 0) pageSize = 10;        
	     if(string.IsNullOrEmpty(name))
			{
			return	BadRequest(new { ok = false , msg = "No hay usuario enviado" });
			}		
       // 2. Buscamos usuarios que CONTENGAN el string (Como el $regex de Mongo)
         // EF.Functions.Like permite hacer búsquedas case-insensitive nativas en la BD
          var users = await  _context.Users.Where(u => EF.Functions.Like(u.Name , $"%{name}%"))
          .Skip((page - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();
          
          if(users.Count == 0)
			{
			return	NotFound(new { ok = false , msg = "user not found" });
			}
           

            var records = await _context.Users.Where(u => EF.Functions.Like(u.Name , $"%{name}%")).CountAsync();
            var totalPages = (int) Math.Ceiling((double) records / pageSize);
            
            var pagination = new
			{
             currentPage = page,
             limit = pageSize,
             hasPrev = page > 1,
             hasNext = page < totalPages
 
			};
            var data = new { ok = true, data = users , pagination = pagination };
            return Ok(new { data });
               
		}

        [HttpGet("{id}/products")]
     public async Task<IActionResult> GetUserProducts(
       [FromRoute] int id,  // 1. Obligatorio al principio (Ruta)
       [FromQuery] int page = 1,                   // 2. Opcionales al final
       [FromQuery] int pageSize = 20
       )
    {
    // Validaciones de paginación
    if (page <= 0) page = 1;
    if (pageSize <= 0) pageSize = 20;

    // Ejecutamos el Query con el Filtro, el JOIN (Include) y el Mapeo (Select)
    var user = await _context.Users
        .Where(u => u.Id == id)
        .Include(u => u.Products)
        .Select(u => new
        {
            id = u.Id,
            name = u.Name,
            // Aplicamos la paginación directamente sobre los productos del usuario
            products = u.Products
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    price = p.Price
                    // Aquí puedes agregar más campos del producto si los necesitas
                })
                .ToList()
        })
        .FirstOrDefaultAsync(); // Usamos FirstOrDefault porque buscamos UN SOLO usuario por ID

    // Si el usuario no existe en la base de datos, 'user' será null
    if (user == null)
    {
        return NotFound(new { ok = false, msg = "Usuario no encontrado" });
    }

     return Ok(new { ok = true, msg = "Usuario encontrado.", data = user });
    }
    [HttpGet("{id}")]
    async public Task<IActionResult> GetUserById([FromRoute] int? id) 
	{  
	 if(id == null)
			{
				return BadRequest(new { ok = false , msg = "Id no enviado" });
			}
      var user = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
      if(user == null)
			{
				return NotFound(new { ok = false , msg = "Usuario no encontrado" });
			}
       return Ok(new { ok = true , msg = "Usuario encontrado" , data = user });
	} 
     
	

    [HttpPost] // <-- Recuerda poner el atributo arriba para mapear la ruta POST
public async Task<IActionResult> CreateUser([FromBody] CreateUserDto userDto)
{
    if (string.IsNullOrEmpty(userDto.Name))
    {
        return BadRequest(new { ok = false, msg = "Falta el campo NAME en el cuerpo" });
    }

    // Traducimos el DTO al plano real de la base de datos (Modelo User)
    var nuevoUsuario = new User
    {
        Name = userDto.Name
    };

    _context.Users.Add(nuevoUsuario);
    await _context.SaveChangesAsync();

    return StatusCode(201, new { ok = true, msg = "Usuario creado con éxito", data = nuevoUsuario });
}

 [HttpPut("{id}")]
  async public Task<IActionResult> UpdateUser([FromRoute] int id , [FromBody] UpdateUserDto updateUserDto) {
    if(string.IsNullOrEmpty(updateUserDto.Name))
			{
		return	BadRequest(new { ok = false , msg = "No hay id enviado" });
			}
       var existingUser = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
       if(existingUser == null)
			{
		return NotFound(new { ok = false , msg = "No se encontró al usuario" });
			}

        existingUser.Name = updateUserDto.Name;
        await _context.SaveChangesAsync();
        
        return Ok(new { ok = true, msg = "Usuario actualizado con éxito.", data = existingUser });
 }


  [HttpDelete("{id}")]
  async public Task<IActionResult> DeleteUser([FromRoute] int id)
		{
			var existingUser = await _context.Users.Where(u => u.Id == id).FirstOrDefaultAsync();
            if(existingUser == null)
			{
				return NotFound(new { ok = false , msg = "No se encontró usuario. con id " + id });
			}
            _context.Users.Remove(existingUser);
            await _context.SaveChangesAsync();
        return Ok(new { ok = true, msg = $"Usuario con ID {id} y todos sus productos relacionados fueron eliminados en cascada."});
		}
    
}
}
   


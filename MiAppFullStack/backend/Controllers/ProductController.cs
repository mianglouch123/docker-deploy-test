using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;



using MyFirstApi.Data;
using MyFirstApi.Models;

namespace MyFirstApi.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
  public class ProductController(DataContext context) : ControllerBase
	{
     private readonly DataContext _context = context;

    [HttpGet("filter")]



    [HttpGet] // la ruta se vuelve "api/user"
     public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1 , [FromQuery] int pageSize = 20)
		{
        if(page <= 0) page = 1;
        if(pageSize <= 0) pageSize = 20;

       var totalRecords = await _context.Products.CountAsync();

        var users = await _context.Products
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
 
         var totalPages = (int) Math.Ceiling((double) (totalRecords / pageSize)); 
         var paginationMetaData = new
		 {
		  total = totalRecords,
          currentPage = page,
          pageSize = pageSize,
          totalPages = totalPages
		 };

          return Ok(new { data = users , pagination = paginationMetaData });
		}

        
 
	}	

}


using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;


namespace MyFirstApi.Middlewares
{
	public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
	{
    public async ValueTask<bool> TryHandleAsync(
     HttpContext httpContext,
     Exception exception,
     CancellationToken cancellationToken
     ) 
     {
      logger.LogError(exception, "An unabled exception ocurred {Message}" , exception.Message);
      var problemDetails = new ProblemDetails
	  {
		Status = StatusCodes.Status500InternalServerError,
        Title = "Ocurrió un error inesperado en el sistema. Por favor, contacte al administrador.",
        Detail = exception.Message,
        Instance = httpContext.Request.Path
	  };
      httpContext.Response.StatusCode = problemDetails.Status.Value;
      await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
      return true;
     }    		
	}

}


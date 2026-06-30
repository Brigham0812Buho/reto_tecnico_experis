using System.Net;
using System.Text.Json;
using TaskManager.Domain.Exceptions;

namespace TaskManager.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            _logger.LogWarning(ex, "Domain rule violation.");
            await WriteResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument.");
            await WriteResponse(context, HttpStatusCode.BadRequest, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error.");
            await WriteResponse(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.");
        }
    }

    private static async Task WriteResponse(HttpContext context, HttpStatusCode status, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode  = (int)status;

        var body = JsonSerializer.Serialize(new { message });
        await context.Response.WriteAsync(body);
    }
}
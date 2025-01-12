using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
public class AdminOnly : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext actionContext, ActionExecutionDelegate next)
    {
        var context = actionContext.HttpContext;
        var options = context.RequestServices.GetService<IOptions<Options>>()?.Value ??
            new Options() { AdminUsernames = new List<string>() };

        // Check if AdminUsername is passed in the headers first
        var adminUsernameFromHeader = context.Request.Headers["AdminUsername"].ToString();

        if (string.IsNullOrEmpty(adminUsernameFromHeader) || !options.AdminUsernames.Contains(adminUsernameFromHeader))
        {
            string logs = $"{context.Request.Method} {context.Request.Path} was requested but user {adminUsernameFromHeader} is not admin!\n";
            context.Response.StatusCode = 401;
            File.AppendAllText("logs.txt", logs);
            return;
        }

        await next();
    }
}


public class Options {
    public List<string>? AdminUsernames { get; set; }
}
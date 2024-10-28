using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;
public class AdminOnly : Attribute, IAsyncActionFilter {
    public async Task OnActionExecutionAsync(ActionExecutingContext actionContext, ActionExecutionDelegate next) {
        var context = actionContext.HttpContext;

        if (context.Session.GetString("Username") == "test") {
            string logs = $"{context.Request.Method} {context.Request.Path} was requested but user is not admin!\n";
            context.Response.StatusCode = 401;
            File.AppendAllText("logs.txt", logs);
            return;
        }
        if (context.Session.GetString("Email") == "test") {
            string logs = $"{context.Request.Method} {context.Request.Path} was requested but but user is not admin!\n";
            context.Response.StatusCode = 401;
            File.AppendAllText("logs.txt", logs);
            return;
        }
        await next();
    }
}

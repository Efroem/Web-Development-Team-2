using Backend.Models;
using EmailExample;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Interfaces;


namespace StarterKit.Controllers
{
    [Route("api/v1/Adminlogin")]
    public class AdminController : ControllerBase
    {
        private readonly MailSender _mailSender;
        private readonly ILoginService _loginService;

        public AdminController(ILoginService loginService)
        {
            _mailSender = new MailSender();
            _loginService = loginService;
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.UserName) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Username and password cannot be empty." });
            }

            bool isValidAdmin = _loginService.ValidateAdmin(request.UserName, request.Password);

            if (!isValidAdmin)
            {
                return BadRequest(new { message = "Invalid username or password" });
            }

            _loginService.SetAdminUsername(request.UserName);
            return Ok(new { message = "Login successful", username = request.UserName });
        }



        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (!_loginService.IsUserLoggedIn())
            {
                return Ok("There is no active session.");
            }
            _loginService.Logout();
            return Ok("User has been logged out.");
        }


        [HttpGet("session")]
        public IActionResult RegisteredSession()
        {
            bool isLoggedIn = _loginService.IsUserLoggedIn();
            string username = _loginService.GetAdminUsername();

            if (isLoggedIn)
            {
                return Ok($"User is logged in as {username}.");
            }
            else
            {
                return Ok("User is not logged in.");
            }
        }
    }
}
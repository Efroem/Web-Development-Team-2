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
                return BadRequest("Username and password cannot be empty.");
            }

            bool isValidAdmin = _loginService.ValidateAdmin(request.UserName, request.Password);

            if (!isValidAdmin)
            {
                return Unauthorized("Invalid username or password");
            }
            _loginService.SetAdminUsername(request.UserName);
            return Ok($"Login successful with username: {request.UserName}!");
        }


        [HttpGet("session")]
        public IActionResult RegisteredSession()
        {
            bool isLoggedIn = _loginService.IsUserLoggedIn();
            string username = _loginService.GetAdminUsername();

            if (isLoggedIn)
            {
                _mailSender.SendEmail();
                return Ok($"User is logged in as {username}.");
            }
            else
            {
                return Ok("User is not logged in.");
            }
        }
    }
}
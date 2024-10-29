using Microsoft.AspNetCore.Mvc;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/v1/AdminLoginSystem")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly ILoginService _loginService;
        private readonly IAdminService _adminService;

        public AdminController(ILoginService loginService, IAdminService adminService)
        {
            _loginService = loginService;
            _adminService = adminService;
        }

        [HttpPost("Login")]
        public IActionResult AdminLogin([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
                return BadRequest("Invalid login request. Provide a username and password");

            var adminLoggedIn = _loginService.Login(loginRequest.UserName, loginRequest.Password, out string errorMessage);

            if (!adminLoggedIn)
                return Unauthorized($"Failed login: {errorMessage}");

            return Ok("Successfully logged in!");
        }

        [HttpGet("IsLoggedIn")]
        public IActionResult IsAdminLoggedIn([FromQuery] string userName)
        {
            var loggedIn = _loginService.IsAdminLoggedIn(userName);

            if (!loggedIn)
                return Unauthorized("No admin is logged in.");

            if (!_adminService.IsAdminUser(userName))
                return Unauthorized("UserName is not an admin.");

            return Ok($"{userName} is logged in as an admin.");
        }
    }
}

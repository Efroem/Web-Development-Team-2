using Microsoft.AspNetCore.Http;
using StarterKit.Interfaces;
using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;

namespace StarterKit.Services
{
    public class LoginService : ILoginService
    {
        private readonly DatabaseContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public LoginService(DatabaseContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public bool ValidateAdmin(string username, string password)
        {
            var admin = _context.Admin.FirstOrDefault(a => a.UserName == username);

            if (admin == null)
            {
                return false; 
            }

            var hashedPassword = EncryptionHelper.EncryptPassword(password);

            return hashedPassword == admin.Password;
        }


        public void SetAdminUsername(string username)
        {
            _httpContextAccessor.HttpContext.Session.SetString("AdminUsername", username);
        }

        public bool IsUserLoggedIn()
        {
            return _httpContextAccessor.HttpContext.Session.GetString("AdminUsername") != null;
        }

        public string GetAdminUsername()
        {
            return _httpContextAccessor.HttpContext.Session.GetString("AdminUsername");
        }
        public void Logout()
        {
            _httpContextAccessor.HttpContext.Session.Clear();
        }
    }
}
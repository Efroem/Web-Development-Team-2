using Backend.Interfaces;
using StarterKit.Models;
using StarterKit.Utils;

namespace Backend.Services
{
    public class LoginService : ILoginService
    {
        private readonly DatabaseContext _dbContext;

        public LoginService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool Login(string userName, string password, out string errorMessage)
        {
            var admin = _dbContext.Admin.FirstOrDefault(e => e.UserName == userName);

            if (admin == null)
            {
                errorMessage = "The username for this admin does not exist";
                return false;
            }

            var encryptedPassword = EncryptionHelper.EncryptPassword(password);
            if (admin.Password != encryptedPassword)
            {
                errorMessage = "The password is incorrect";
                return false;
            }

            // Login successful
            errorMessage = null;
            return true;
        }

        public bool IsAdminLoggedIn(string userName)
        {
            return _dbContext.Admin.Any(e => e.UserName == userName);
        }
    }
}

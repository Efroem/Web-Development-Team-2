using Backend.Interfaces;
using StarterKit.Models;  
using System.Linq;

namespace Backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly DatabaseContext _context;

        public AdminService(DatabaseContext context)
        {
            _context = context;
        }

        public bool IsAdminUser(string userName)
        {
            var adminUser = _context.Admin.SingleOrDefault(u => u.UserName == userName);
            return adminUser != null;
        }
    }
}
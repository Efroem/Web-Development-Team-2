namespace Backend.Interfaces
{
    public interface ILoginService
    {
        bool Login(string userName, string password, out string errorMessage);
        bool IsAdminLoggedIn(string userName);
    }
}

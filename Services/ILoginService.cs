namespace StarterKit.Interfaces
{
    public interface ILoginService
    {
        bool ValidateAdmin(string username, string password);
        void SetAdminUsername(string username);
        bool IsUserLoggedIn();
        string GetAdminUsername();
    }
}
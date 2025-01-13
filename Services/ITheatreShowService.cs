using StarterKit.Models;

namespace StarterKit.Services;

public interface ITheatreShowService {
    Task<bool> Create (TheatreShow theatreShow, Venue? venue, List<TheatreShowDate> theatreShowDates);
    Task<TheatreShowCollective> GetById (int theatreShowId);
    Task<IEnumerable<TheatreShowCollective>> GetAll ();
    Task<IEnumerable<Venue>> GetAllVenues ();
    Task<bool> Delete (int theatreShowId); 
    Task<bool> Update (TheatreShowCollective theatreShowCollective, int theatreShowId);
}
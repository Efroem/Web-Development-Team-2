using StarterKit.Models;

namespace StarterKit.Services;

public interface ITheatreShowService {
    Task<bool> Create (TheatreShow theatreShow, Venue? venue, List<TheatreShowDate> theatreShowDates);
    Task<TheatreShowCollective> GetById (int theatreShowId);
    Task<IEnumerable<TheatreShowCollective>> GetAll ();
    Task<bool> Delete (int theatreShowId); 
    Task<bool> Update (TheatreShow theatreShow, int theatreShowId);
}
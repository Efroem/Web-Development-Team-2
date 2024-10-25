using StarterKit.Models;

namespace StarterKit.Services;

public interface ITheatreShowService {
    Task<bool> Create (TheatreShow theatreShow, Venue? venue, List<TheatreShowDate> theatreShowDates);
    Task<TheatreShow> GetById (int theatreShowId);
    Task<IEnumerable<TheatreShow>> GetAll ();
    Task<bool> Delete (int theatreShowId); 
    Task<bool> Update (TheatreShow theatreShow, int theatreShowId);
}
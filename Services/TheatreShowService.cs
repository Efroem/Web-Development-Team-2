using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class TheatreShowService : ITheatreShowService
{
    DatabaseContext dbContext;
    public TheatreShowService(DatabaseContext dbContext) {
        this.dbContext = dbContext;
    }

    public async Task<bool> Create(TheatreShow theatreShow, Venue? venue, List<TheatreShowDate> theatreShowDates)
    {
        var x = await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShow.TheatreShowId);
        if (x != null) return false;
        var venueInDB = await dbContext.Venue.FirstOrDefaultAsync(x => x.VenueId == venue.VenueId);
        int n = 1; // Give a default value to N incate the venue already exists
        if (venueInDB == null) {
            await dbContext.Venue.AddAsync(venue);
            n = await dbContext.SaveChangesAsync();
        }
        theatreShow.VenueId = venue.VenueId;
        await dbContext.TheatreShow.AddAsync(theatreShow);
        int n2 = await dbContext.SaveChangesAsync();
        foreach (TheatreShowDate date in theatreShowDates) {
            date.TheatreShowId = theatreShow.TheatreShowId;
            await dbContext.TheatreShowDate.AddAsync(date);
        }

        int n3 = await dbContext.SaveChangesAsync();
        return n > 0 & n2 > 0 & n3 > 0;

    }

    public async Task<bool> Delete(int theatreShowId)
    {
        var x = await dbContext.TheatreShow.FindAsync(theatreShowId);
        if (x == null) return false;
        // List<TheatreShowDate>? theatreShowDates = await dbContext.TheatreShowDate.Where(x => x.TheatreShowDateId == theatreShowId).ToListAsync();
        // if (theatreShowDates.Count == 0) return false;
        // foreach (TheatreShowDate date in theatreShowDates) {
        //     var reservations = await dbContext.Reservation.Where(x => x.TheatreShowDate.TheatreShowDateId == date.TheatreShowDateId).ToListAsync();
        //     foreach (var reservation in reservations) {
        //         dbContext.Reservation.Remove(reservation);
        //     }
        //     dbContext.TheatreShowDate.Remove(date);
        // }

        dbContext.TheatreShow.Remove(x);
        int n = await dbContext.SaveChangesAsync();
        // return n > 0 && m > 0;
        return n > 0;
    }

    public async Task<IEnumerable<TheatreShowCollective>> GetAll()
    {
        List<TheatreShowCollective> theatreShowCollectives = new List<TheatreShowCollective>();
        List<TheatreShow> theatreShows = await dbContext.TheatreShow.ToListAsync();
        foreach (TheatreShow show in theatreShows) {
            List<TheatreShowDate> theatreShowDates = await dbContext.TheatreShowDate.Where(x => x.TheatreShowId == show.TheatreShowId).ToListAsync();
            Venue? venue = await dbContext.Venue.FirstOrDefaultAsync(x => x.VenueId == show.VenueId);
            TheatreShowCollective theatreShowCollective= new TheatreShowCollective {
                TheatreShowId = show.TheatreShowId,
                Title = show.Title,
                Description = show.Description,
                Price = show.Price,
                TheatreShowDates = theatreShowDates,
                ShowMood = show.ShowMood,
                Venue = venue
            };      
            theatreShowCollectives.Add(theatreShowCollective);
        }
        

        return theatreShowCollectives;
    }

    public async Task<IEnumerable<Venue>> GetAllVenues() {
        return await dbContext.Venue.ToListAsync();
    }


    public async Task<TheatreShowCollective> GetById(int theatreShowId)
    {
        TheatreShow? theatreShow = await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShowId);
        if (theatreShow == null) return null;
        List<TheatreShowDate> theatreShowDates = await dbContext.TheatreShowDate.Where(x => x.TheatreShowId == theatreShow.TheatreShowId).ToListAsync();
        Venue? venue = await dbContext.Venue.FirstOrDefaultAsync(x => x.VenueId == theatreShow.VenueId);
        TheatreShowCollective theatreShowCollective= new TheatreShowCollective {
            TheatreShowId = theatreShowId,
            Title = theatreShow.Title,
            Description = theatreShow.Description,
            Price = theatreShow.Price,
            TheatreShowDates = theatreShowDates,
            Venue = venue
        };
        return theatreShowCollective;
        
        // throw new NotImplementedException();
    }

    public async Task<bool> Update(TheatreShow theatreShow, int theatreShowId)
    {
        TheatreShow x = await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShowId);
        if (x == null) return false;
        dbContext.Entry(x).CurrentValues["Title"] = theatreShow.Title;
        dbContext.Entry(x).CurrentValues["Description"] = theatreShow.Description;
        dbContext.Entry(x).CurrentValues["Price"] = theatreShow.Price;
        dbContext.Entry(x).CurrentValues["VenueId"] = theatreShow.VenueId;
        dbContext.Entry(x).CurrentValues["Description"] = theatreShow;

        int n = dbContext.SaveChanges();
        return n>0;
        throw new NotImplementedException();
    }

}
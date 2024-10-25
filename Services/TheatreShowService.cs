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
        int n = 1;
        if (venueInDB == null) {
            await dbContext.Venue.AddAsync(venue);
            n = await dbContext.SaveChangesAsync();
        }
        theatreShow.VenueId = venue.VenueId;
        await dbContext.TheatreShow.AddAsync(theatreShow);
        int n2 = await dbContext.SaveChangesAsync();
        foreach (TheatreShowDate date in theatreShowDates) {
            date.TheatreShow = theatreShow;
            await dbContext.TheatreShowDate.AddAsync(date);
        }

        int n3 = await dbContext.SaveChangesAsync();
        return n > 0 & n2 > 0 & n3 > 0;

    }

    public async Task<bool> Delete(int theatreShowId)
    {
        var x = await dbContext.TheatreShow.FindAsync(theatreShowId);
        if (x == null) return false;
        dbContext.TheatreShow.Remove(x);
        int n = dbContext.SaveChanges();
        return n > 0;
    }

    public async Task<IEnumerable<TheatreShow>> GetAll()
    {
        return await dbContext.TheatreShow.ToListAsync();
        // throw new NotImplementedException();
    }

    public async Task<TheatreShow> GetById(int theatreShowId)
    {
        return await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShowId);
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
        int n = dbContext.SaveChanges();
        return n>0;
        throw new NotImplementedException();
    }

}
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class TheatreShowService : ITheatreShowService
{
    DatabaseContext dbContext;
    public TheatreShowService(DatabaseContext dbContext) {
        this.dbContext = dbContext;
    }

    public async Task<bool> Create(TheatreShow theatreShow)
    {
        var x = dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShow.TheatreShowId);
        if (x != null) return false;
        await dbContext.TheatreShow.AddAsync(theatreShow);
        int n = await dbContext.SaveChangesAsync();
        return n > 0;

    }

    public async Task<bool> Delete(int theatreShowId)
    {
        TheatreShow x = await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShowId);
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
        throw new NotImplementedException();
    }

    public async Task<bool> Update(TheatreShow theatreShow, int theatreShowId)
    {
        TheatreShow x = await dbContext.TheatreShow.FirstOrDefaultAsync(x => x.TheatreShowId == theatreShowId);
        if (x == null) return false;
        dbContext.Entry(x).CurrentValues.SetValues(theatreShow);
        int n = dbContext.SaveChanges();
        return n>0;
        throw new NotImplementedException();
    }

}
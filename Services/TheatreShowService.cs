using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class TheatreShowService : ITheatreShowService
{
    DbContext dbContext;
    public TheatreShowService(DbContext dbContext) {
        this.dbContext = dbContext;
    }

    public async Task<bool> Create(TheatreShow theatreShow)
    {
        dbContext.Add<TheatreShow>(theatreShow)
        throw new NotImplementedException();
    }

    public async Task<bool> Delete(int theatreShowId)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<TheatreShow>> GetAll()
    {
        throw new NotImplementedException();
    }

    public async Task<TheatreShow> GetById(int theatreShowId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> Update(TheatreShow theatreShow, int theatreShowId)
    {
        throw new NotImplementedException();
    }
}
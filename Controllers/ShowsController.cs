using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;

[ApiController]
[Route("api/shows")]
public class ShowsController : ControllerBase
{
    private readonly DatabaseContext _context;

    public ShowsController(DatabaseContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetShows()
    {
        var shows = await _context.TheatreShow
                                  .Select(s => new { s.TheatreShowId, s.Title })
                                  .ToListAsync();

        return Ok(shows);
    }
}

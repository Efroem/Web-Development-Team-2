using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/v1/TheatreShows")]
public class TheatreShowController : Controller {
    
    private readonly ITheatreShowService theatreShowService;

    public TheatreShowController(ITheatreShowService theatreShowService) {
        this.theatreShowService = theatreShowService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTheatreShows([FromQuery]int id = -1) {
        if (id == -1) {
            return Ok(theatreShowService.GetAll());
        }
        TheatreShow theatreShow = await theatreShowService.GetById(id);
        if (theatreShow != null) return Ok(theatreShow);
        return BadRequest("TheatreShow with this ID does not exist");
    }   
}
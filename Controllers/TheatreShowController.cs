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
    public async Task<IActionResult> GetTheatreShows() {
        return Ok(await theatreShowService.GetAll());
    }   
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTheatreShowById(int id) {
        TheatreShow theatreShow = await theatreShowService.GetById(id);
        if (theatreShow != null) return Ok(theatreShow);
        return BadRequest($"TheatreShow with this ID does not exist ({theatreShow})");
    }   

    [HttpPost()]
    public async Task<IActionResult> PostTheatreShow([FromBody] TheatreShow theatreShow) {
        bool addedToDB = await theatreShowService.Create(theatreShow);
        return addedToDB == true ? Ok(theatreShow) : BadRequest("Failed to add TheatreShow to DB. Entry already exists");
    }

    [HttpPut("{theatreShowId}")]
    public async Task<IActionResult> UpdateTheatreShow([FromBody] TheatreShow theatreShow, int theatreShowId) {
        // return Ok($"{theatreShowId}");
        bool updatedTheatreShow = await theatreShowService.Update(theatreShow, theatreShowId);
        return updatedTheatreShow == true ? Ok($"Successfully updated") : BadRequest("Failed to update TheatreShow");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTheatreShow(int id) {
        bool removedFromDB = await theatreShowService.Delete(id);
        return removedFromDB == true ? Ok($"TheatreShow with id {id} was successfully removed from db") : BadRequest("Failed to remove TheatreShow to DB. Entry does not exist");
    }

}
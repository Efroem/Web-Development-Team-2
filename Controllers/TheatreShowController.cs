using System.Diagnostics;
using System.Globalization;
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
        // string dateStr = "08-25-2004 09:15";
        // DateTime date1 = DateTime.ParseExact(dateStr, "MM-dd-yyyy HH:mm", CultureInfo.InvariantCulture);
        // DateTime date = DateTime.Now;
        // return Ok($"{date}  \n{date1}");
        TheatreShow theatreShow = await theatreShowService.GetById(id);
        if (theatreShow != null) return Ok(theatreShow);
        return BadRequest($"TheatreShow with this ID does not exist ({theatreShow})");
    }   

    [HttpPost()]
    public async Task<IActionResult> PostTheatreShow([FromBody] TheatreShowCreator theatreShowCreator) {
        TheatreShow theatreShow = new TheatreShow();
        theatreShow.Title = theatreShowCreator.Title;
        theatreShow.Description = theatreShowCreator.Description;
        theatreShow.Price = theatreShowCreator.Price;
        theatreShow.VenueId = theatreShowCreator.Venue != null ? theatreShowCreator.Venue.VenueId : 0;
        bool addedToDB = await theatreShowService.Create(theatreShow, theatreShowCreator.Venue, theatreShowCreator.TheatreShowDates);
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
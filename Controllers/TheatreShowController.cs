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
public async Task<IActionResult> GetTheatreShows(
    int? id = null,
    string? title = null,
    string? description = null,
    string? location = null,
    DateTime? startDate = null,
    DateTime? endDate = null,
    string? sortBy = null,
    bool ascending = true)
{
    var shows = await theatreShowService.GetAll();

    if (id.HasValue)
    {
        shows = shows.Where(show => show.TheatreShowId == id.Value).ToList();
    }

    if (!string.IsNullOrEmpty(title))
    {
        shows = shows.Where(show => show.Title != null && show.Title.Contains(title, StringComparison.OrdinalIgnoreCase)).ToList();
    }
    if (!string.IsNullOrEmpty(description))
    {
        shows = shows.Where(show => show.Description != null && show.Description.Contains(description, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    if (!string.IsNullOrEmpty(location))
    {
        shows = shows.Where(show => show.Venue != null && show.Venue.Name != null && show.Venue.Name.Contains(location, StringComparison.OrdinalIgnoreCase)).ToList();
    }

    if (startDate.HasValue || endDate.HasValue)
    {
        shows = shows.Where(show => show.TheatreShowDates != null && show.TheatreShowDates.Any(date =>
            (!startDate.HasValue || date.DateAndTime >= startDate.Value) &&
            (!endDate.HasValue || date.DateAndTime <= endDate.Value))).ToList();
    }

    if (!string.IsNullOrEmpty(sortBy))
    {
        shows = sortBy.ToLower() switch
        {
            "title" => ascending ? shows.OrderBy(show => show.Title).ToList() : shows.OrderByDescending(show => show.Title).ToList(),
            "price" => ascending ? shows.OrderBy(show => show.Price).ToList() : shows.OrderByDescending(show => show.Price).ToList(),
            "date" => ascending ? shows.OrderBy(show => show.TheatreShowDates?.FirstOrDefault()?.DateAndTime).ToList() :
                                  shows.OrderByDescending(show => show.TheatreShowDates?.FirstOrDefault()?.DateAndTime).ToList(),
            _ => shows
        };
    }

    return Ok(shows);
}
    
[HttpGet("{id}")]
public async Task<IActionResult> GetTheatreShowById(int id) {
    TheatreShowCollective? theatreShow = await theatreShowService.GetById(id);

    if (theatreShow != null) {
        return Ok(theatreShow);
    } else {
        return NotFound($"TheatreShow with ID {id} does not exist.");
    }
}
  

    [HttpPost()]
    public async Task<IActionResult> PostTheatreShow([FromBody] TheatreShowCollective theatreShowCreator) {
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
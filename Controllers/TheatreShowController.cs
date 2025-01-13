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
    
    [HttpGet("Venues")]
    public async Task<IActionResult> GetAllVenues() {
        var venues = await theatreShowService.GetAllVenues();
    if (venues == null || !venues.Any()) {
        return NotFound("No venues found");
    }
        return Ok(venues);
    }

    [AdminOnly]
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

    [AdminOnly]
    [HttpPut("{theatreShowId}")]
    public async Task<IActionResult> UpdateTheatreShow(int theatreShowId, [FromBody] TheatreShowCollective updatedShow)
    {
        if (updatedShow == null)
        {
            return BadRequest("The request payload is null or malformed.");
        }

        if (updatedShow.TheatreShowId != 0 && updatedShow.TheatreShowId != theatreShowId)
        {
            return BadRequest($"The TheatreShowId in the payload ({updatedShow.TheatreShowId}) does not match the URL ({theatreShowId}).");
        }

        updatedShow.TheatreShowId = theatreShowId;

        bool success = await theatreShowService.Update(updatedShow, theatreShowId);

        return success
            ? Ok("TheatreShow and associated dates updated successfully.")
            : NotFound($"No TheatreShow found with ID {theatreShowId}.");
    }
}
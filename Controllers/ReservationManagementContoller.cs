using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers
{
    [ApiController]
    [Route("api/v1/ReservationManagement")]
    public class ReservationManagementController : ControllerBase
    {
        private readonly DatabaseContext _dbContext;

        public ReservationManagementController(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET endpoint to retrieve all reservations with filtering
        [HttpGet]
        public async Task<IActionResult> GetReservations(int? showId = null, DateTime? dateTime = null, string? email = null, int? reservationId = null)
        {
            var reservations = _dbContext.Reservation
                .Include(r => r.Customer)
                .AsQueryable();

            // Filter by email
            if (!string.IsNullOrEmpty(email))
            {
                reservations = reservations.Where(r => r.Customer.Email.ToLower().Contains(email.ToLower()));
            }

            // Filter by reservation ID
            if (reservationId.HasValue)
            {
                reservations = reservations.Where(r => r.ReservationId == reservationId.Value);
            }

            var reservationList = await reservations.ToListAsync();

            var result = new List<object>();

            foreach (var reservation in reservationList)
            {
                var showDate = await _dbContext.TheatreShowDate
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservation.TheatreShowDateId);

                if (showDate == null) continue;

                var theatreShow = await _dbContext.TheatreShow
                    .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);

                if (theatreShow == null) continue;

                // Apply filters for show ID and exact date and time
                if (showId.HasValue && theatreShow.TheatreShowId != showId.Value) continue;
                if (dateTime.HasValue && showDate.DateAndTime != dateTime.Value) continue;

                result.Add(new
                {
                    reservation.ReservationId,
                    reservation.AmountOfTickets,
                    reservation.Used,
                    theatreShow.Title,
                    Date = showDate.DateAndTime,
                    reservation.Customer.Email
                });
            }

            return Ok(result);
        }


        // PATCH endpoint to mark a reservation as used
        [HttpPatch("{reservationId}/mark-as-used")]
        public async Task<IActionResult> MarkReservationAsUsed(int reservationId)
        {
            var reservation = await _dbContext.Reservation.FindAsync(reservationId);

            if (reservation == null)
            {
                return NotFound(new { Message = "Reservation not found." });
            }

            // Mark reservation as used
            reservation.Used = true;
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Reservation marked as used." });
        }

        // DELETE endpoint to delete a reservation
        [HttpDelete("{reservationId}")]
        public async Task<IActionResult> DeleteReservation(int reservationId)
        {
            var reservation = await _dbContext.Reservation.FindAsync(reservationId);

            if (reservation == null)
            {
                return NotFound(new { Message = "Reservation not found." });
            }

            _dbContext.Reservation.Remove(reservation);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Reservation deleted successfully." });
        }
    }
}

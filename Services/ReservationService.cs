using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services
{
    public interface IReservationService
    {
        Task<ReservationResponse> MakeReservationAsync(ReservationRequest request);
    }

    public class ReservationService : IReservationService
    {
        private readonly DatabaseContext _dbContext;

        public ReservationService(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ReservationResponse> MakeReservationAsync(ReservationRequest request)
        {
            decimal totalPrice = 0;

            foreach (var reservationItem in request.Reservations)
            {
                // Check if show date exists and is valid
                var showDate = await _dbContext.TheatreShowDate
                    .Include(sd => sd.TheatreShow)
                    .ThenInclude(ts => ts.Venue)
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservationItem.ShowDateId);

                if (showDate == null || showDate.DateAndTime < DateTime.Now)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Invalid or past show date." };
                }

                // Check ticket availability
                var reservedTickets = await _dbContext.Reservation
                    .Where(r => r.TheatreShowDate.TheatreShowDateId == reservationItem.ShowDateId)
                    .SumAsync(r => r.AmountOfTickets);

                var availableTickets = showDate.TheatreShow.Venue.Capacity - reservedTickets;

                if (availableTickets < reservationItem.TicketCount)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = $"Not enough tickets for show date {showDate.DateAndTime}." };
                }

                // Calculate total price
                totalPrice += reservationItem.TicketCount * (decimal)showDate.TheatreShow.Price;
            }

            // Create and save reservation
            var customer = await _dbContext.Customer.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                customer = new Customer { FirstName = request.FirstName, LastName = request.LastName, Email = request.Email };
                await _dbContext.Customer.AddAsync(customer);
            }

            var newReservation = new Reservation
            {
                Customer = customer,
                AmountOfTickets = request.Reservations.Sum(r => r.TicketCount),
                TheatreShowDate = await _dbContext.TheatreShowDate.FirstOrDefaultAsync(sd => sd.TheatreShowDateId == request.Reservations[0].ShowDateId)
            };

            await _dbContext.Reservation.AddAsync(newReservation);
            await _dbContext.SaveChangesAsync();

            return new ReservationResponse { Success = true, TotalPrice = totalPrice };
        }
    }
}
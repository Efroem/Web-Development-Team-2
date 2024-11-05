using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services
{
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
                // Retrieve the show date by ID
                var showDate = await _dbContext.TheatreShowDate
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservationItem.ShowDateId);

                if (showDate == null || showDate.DateAndTime < DateTime.Now)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Invalid or past show date." };
                }

                // Retrieve the related TheatreShow and Venue for the capacity and price
                var theatreShow = await _dbContext.TheatreShow
                    .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);

                if (theatreShow == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Associated show not found." };
                }

                var venue = await _dbContext.Venue
                    .FirstOrDefaultAsync(v => v.VenueId == theatreShow.VenueId);

                if (venue == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = "Associated venue not found." };
                }

                // Calculate the reserved tickets for the show date
                var reservedTickets = await _dbContext.Reservation
                    .Where(r => r.TheatreShowDateId == reservationItem.ShowDateId)
                    .SumAsync(r => r.AmountOfTickets);

                // Check if the venue has sufficient capacity
                var availableTickets = venue.Capacity - reservedTickets;

                if (availableTickets < reservationItem.TicketCount)
                {
                    return new ReservationResponse
                    {
                        Success = false,
                        ErrorMessage = $"Not enough tickets for {theatreShow.Title} on {showDate.DateAndTime:dd-MM-yyyy HH:mm}."
                    };
                }

                // Calculate the total price
                totalPrice += reservationItem.TicketCount * (decimal)theatreShow.Price;
            }

            // Find or create the customer
            var customer = await _dbContext.Customer.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                customer = new Customer { FirstName = request.FirstName, LastName = request.LastName, Email = request.Email };
                await _dbContext.Customer.AddAsync(customer);
            }

            // Create and save the reservation
            var newReservation = new Reservation
            {
                Customer = customer,
                AmountOfTickets = request.Reservations.Sum(r => r.TicketCount),
                TheatreShowDateId = request.Reservations[0].ShowDateId
            };

            await _dbContext.Reservation.AddAsync(newReservation);
            await _dbContext.SaveChangesAsync();

            return new ReservationResponse { Success = true, TotalPrice = totalPrice };
        }
    }
}

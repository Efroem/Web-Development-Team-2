using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using EmailExample;

namespace StarterKit.Services
{
    public class ReservationService : IReservationService
    {
        private readonly DatabaseContext _dbContext;
        private readonly MailSender _mailSender;

        public ReservationService(DatabaseContext dbContext, MailSender mailSender)
        {
            _dbContext = dbContext;
            _mailSender = mailSender;
        }

        public async Task<ReservationResponse> MakeReservationAsync(ReservationRequest request)
        {
            decimal totalPrice = 0;
            var customer = await _dbContext.Customer.FirstOrDefaultAsync(c => c.Email == request.Email);
            if (customer == null)
            {
                customer = new Customer { FirstName = request.FirstName, LastName = request.LastName, Email = request.Email };
                await _dbContext.Customer.AddAsync(customer);
            }

            // First Pass: Validation Only
            foreach (var reservationItem in request.Reservations)
            {
                var showDate = await _dbContext.TheatreShowDate
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservationItem.ShowDateId);

                if (showDate == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = $"Show date with ID {reservationItem.ShowDateId} does not exist." };
                }

                if (showDate.DateAndTime < DateTime.Now)
                {
                    var theatreShowPast = await _dbContext.TheatreShow
                        .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);
                    return new ReservationResponse
                    {
                        Success = false,
                        ErrorMessage = $"The show '{theatreShowPast?.Title}' on {showDate.DateAndTime:dd-MM-yyyy HH:mm} is in the past and cannot be reserved."
                    };
                }

                var theatreShow = await _dbContext.TheatreShow
                    .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);

                if (theatreShow == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = $"Associated show for date ID {reservationItem.ShowDateId} not found." };
                }

                var venue = await _dbContext.Venue
                    .FirstOrDefaultAsync(v => v.VenueId == theatreShow.VenueId);

                if (venue == null)
                {
                    return new ReservationResponse { Success = false, ErrorMessage = $"Venue for show '{theatreShow.Title}' not found." };
                }

                var reservedTickets = await _dbContext.Reservation
                    .Where(r => r.TheatreShowDateId == reservationItem.ShowDateId)
                    .SumAsync(r => r.AmountOfTickets);

                var availableTickets = venue.Capacity - reservedTickets;

                if (availableTickets < reservationItem.TicketCount)
                {
                    return new ReservationResponse
                    {
                        Success = false,
                        ErrorMessage = $"Not enough tickets for '{theatreShow.Title}' on {showDate.DateAndTime:dd-MM-yyyy HH:mm}. Only {availableTickets} tickets remaining."
                    };
                }

                // Accumulate the total price for all reservations
                totalPrice += reservationItem.TicketCount * (decimal)theatreShow.Price;
            }

            // Second Pass: Save Reservations and Send Emails
            foreach (var reservationItem in request.Reservations)
            {
                var showDate = await _dbContext.TheatreShowDate
                    .FirstOrDefaultAsync(sd => sd.TheatreShowDateId == reservationItem.ShowDateId);
                
                var theatreShow = await _dbContext.TheatreShow
                    .FirstOrDefaultAsync(ts => ts.TheatreShowId == showDate.TheatreShowId);

                var venue = await _dbContext.Venue
                    .FirstOrDefaultAsync(v => v.VenueId == theatreShow.VenueId);

                // Create and save the reservation for this specific show
                var newReservation = new Reservation
                {
                    Customer = customer,
                    AmountOfTickets = reservationItem.TicketCount,
                    TheatreShowDateId = reservationItem.ShowDateId
                };

                await _dbContext.Reservation.AddAsync(newReservation);

                // Send email for each valid reservation
                await _mailSender.SendEmailAsync(
                    toEmail: request.Email,
                    customerName: $"{request.FirstName} {request.LastName}",
                    showTitle: theatreShow.Title,
                    venueName: venue.Name,
                    showDate: showDate.DateAndTime,
                    totalPrice: reservationItem.TicketCount * (decimal)theatreShow.Price
                );
            }

            await _dbContext.SaveChangesAsync();

            return new ReservationResponse { Success = true, TotalPrice = totalPrice };
        }


    }
}
